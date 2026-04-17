import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController{
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post('create-user')
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.usersService.createUser(createUserDto)
    }
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async me(@Req() req: any){
        return this.usersService.findById(req.user.userId)
    }
}