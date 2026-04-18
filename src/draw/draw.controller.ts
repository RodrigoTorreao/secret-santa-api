import {
    Controller,
    Post,
    Param,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { DrawService } from './draw.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import type { JwtPayload } from '../auth/jwt-payload.interface'

@ApiTags('Draw')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class DrawController {
    constructor(
        private readonly drawService: DrawService,
    ) {}

    @Post(':groupId/draw')
    @ApiOperation({ summary: 'Execute secret santa draw for a group' })
    @ApiResponse({
        status: 201,
        description: 'Draw executed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid group state or participants',
    })
    @ApiResponse({
        status: 403,
        description: 'Only group creator can execute the draw',
    })
    @ApiResponse({
        status: 404,
        description: 'Group not found',
    })
    @ApiResponse({
        status: 409,
        description: 'Group already drawn',
    })
    async draw(
        @Param('groupId') groupId: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.drawService.draw(groupId, user.sub)
    }
}