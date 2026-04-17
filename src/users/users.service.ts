import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../infra/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'


@Injectable()
export class UsersService{
    constructor(private readonly prisma: PrismaService) {}

    private sanitize(user: any) {
        const { passwordHash, ...safeUser } = user
        return safeUser
    }

    async createUser(data: CreateUserDto){
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            throw new ConflictException('Email already in use')
        }
        const passwordHash = await bcrypt.hash(data.password, 10)
        
        const user = await this.prisma.client.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
        })
        return this.sanitize(user)
    }

    async findByEmail(email: string){
        const existingUser = await this.prisma.client.user.findUnique({
            where: {email}
        })
        if(!existingUser){
            throw new NotFoundException('User not found')
        }
        return this.sanitize(existingUser)
    }
    async findByEmailFull(email: string){
        const existingUser = await this.prisma.client.user.findUnique({
            where: {email}
        })
        if(!existingUser){
            throw new NotFoundException('User not found')
        }
        return existingUser
    }
    async findById(id: string){
        const existingUser = await this.prisma.client.user.findUnique({
            where: {id}
        })
        return this.sanitize(existingUser) 
    }
}