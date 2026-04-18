import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { GroupStatus } from '@prisma/client';

@Injectable()
export class GroupsService{
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createGroup(userId: string, createGroupDto: CreateGroupDto){
        return this.prisma.client.group.create({
            data: {
                name: createGroupDto.name,
                creatorId: userId, 
                participants: {
                    create:{
                        userId
                    }
                }
            }

        })
    }
    
    async listMyGroups(userId: string){
        return this.prisma.client.group.findMany({
            where:{
                OR: [
                    {creatorId: userId},
                    {
                        participants: {some: {userId}}
                    }
                ]
            }
        })
    }

    async addParticipant(
        groupId: string,
        currentUserId: string,
        dto: AddParticipantDto,
    ) {
        const group = await this.prisma.client.group.findUnique({
            where: { id: groupId },
        })

        if (!group) {
            throw new NotFoundException('Group not found')
        }

        if (group.creatorId !== currentUserId) {
            throw new ForbiddenException('Only the creator can add participants')
        }

        if (group.status !== GroupStatus.DRAFT) {
            throw new BadRequestException('Group already drawn')
        }

        const userExists = await this.prisma.client.user.findUnique({
            where: { id: dto.userId },
        })

        if (!userExists) {
            throw new NotFoundException('User not found')
        }

        try {
        return await this.prisma.client.participant.create({
            data: {
            groupId,
            userId: dto.userId,
            },
        })
        } catch {
            throw new BadRequestException('User already in group')
        }
    }
}