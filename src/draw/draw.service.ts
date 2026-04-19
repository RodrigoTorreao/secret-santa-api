import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    ConflictException,
    Logger,
} from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { PrismaService } from '../infra/database/prisma.service'
import { GroupStatus } from '@prisma/client'
import { generateDrawPairs } from './draw.utils'
import { EMAIL_QUEUE } from '../infra/queue/queues'

@Injectable()
export class DrawService {
    private readonly logger = new Logger(DrawService.name)

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue(EMAIL_QUEUE)
        private readonly emailQueue: Queue,
    ) {}

    async draw(groupId: string, currentUserId: string) {
        const group = await this.prisma.client.group.findUnique({
            where: { id: groupId },
            include: {
                participants: {
                    include: {
                        user: true,
                    },
                },
            },
        })

        if (!group) {
            throw new NotFoundException('Group not found')
        }

        if (group.creatorId !== currentUserId) {
            throw new ForbiddenException('Only the group creator can run the draw')
        }

        if (group.status === GroupStatus.DRAWN) {
            throw new ConflictException('Group already drawn')
        }

        if (group.participants.length < 2) {
            throw new BadRequestException(
                'At least 2 participants are required to draw',
            )
        }

        const participantIds = group.participants.map(p => p.userId)

        const drawPairs = generateDrawPairs(participantIds)

        await this.prisma.client.$transaction(async tx => {
            await tx.drawResult.createMany({
                data: drawPairs.map(pair => ({
                    groupId,
                    giverUserId: pair.giverId,
                    receiverUserId: pair.receiverId,
                })),
            })

            await tx.group.update({
                where: { id: groupId },
                data: {
                    status: GroupStatus.DRAWN,
                },
            })
        })

        for (const pair of drawPairs) {
            const giver = group.participants.find(
                p => p.userId === pair.giverId,
            )
            const receiver = group.participants.find(
                p => p.userId === pair.receiverId,
            )

            if (!giver || !receiver) {
                this.logger.warn('Skipping email due to missing user data')
                continue
            }

            await this.emailQueue.add('send-email', {
                to: giver.user.email,
                subject: 'Seu amigo secreto ',
                body: `Olá ${giver.user.name}, você tirou ${receiver.user.name}!`,
            })
        }

        return { message: 'Draw executed successfully' }
    }
}