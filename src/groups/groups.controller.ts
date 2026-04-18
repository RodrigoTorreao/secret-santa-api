import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { AddParticipantDto } from './dto/add-participant.dto'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { JwtPayload } from '../auth/jwt-payload.interface'

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
    constructor(
        private readonly groupsService: GroupsService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new group' })
    @ApiResponse({ status: 201, description: 'Group created successfully' })
    async createGroup(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateGroupDto,
    ) {
        return this.groupsService.createGroup(user.sub, dto)
    }

    @Get()
    @ApiOperation({ summary: 'List groups of logged user' })
    @ApiResponse({ status: 200, description: 'List of groups' })
    async listMyGroups(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.groupsService.listMyGroups(user.sub)
    }

    @Post(':groupId/participants')
    @ApiOperation({ summary: 'Add participant to group' })
    @ApiResponse({ status: 201, description: 'Participant added' })
    async addParticipant(
        @CurrentUser() user: JwtPayload,
        @Param('groupId') groupId: string,
        @Body() dto: AddParticipantDto,
    ) {
        return this.groupsService.addParticipant(groupId, user.sub, dto)
    }
}