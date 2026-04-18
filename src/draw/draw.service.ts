import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'

import { GroupStatus } from '@prisma/client'

import { PrismaService } from '../infra/database/prisma.service'
import { generateDrawPairs } from './draw.utils'

@Injectable()
export class DrawService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async draw(
        groupId: string,
        currentUserId: string,
    ) {
        const group = await this.prisma.client.group.findUnique({
            where: { id: groupId },
            include: {
                participants: true,
            },
        })

        if (!group) {
            throw new NotFoundException('Group not found')
        }

        if (group.creatorId !== currentUserId) {
            throw new ForbiddenException(
                'Only the group creator can run the draw',
            )
        }

        if (group.status === GroupStatus.DRAWN) {
            throw new ConflictException('Group already drawn')
        }

        if (group.participants.length < 2) {
            throw new BadRequestException(
                'At least 2 participants are required to draw',
            )
        }

        const participantIds = group.participants.map(
            participant => participant.userId,
        )

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

        return {
            message: 'Draw executed successfully',
        }
    }
}