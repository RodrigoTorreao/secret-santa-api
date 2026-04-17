import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService{
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService 
    ){}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmailFull(email)
        if(!user){
            throw new UnauthorizedException('Invalid Credentials')
        }
        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        )
        if(!passwordValid){
            throw new UnauthorizedException('Invalid Credentials')
        }
        return this.sanitize(user)

    }

    async login(email: string, password:string){
        const user = await this.validateUser(email, password)
        const payload = {
            sub: user.id,
            email: user.email,
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return{
            accessToken,
            user
        }
    }

    sanitize(user:any){
        const {passordHash, ...safeUser} = user
        return safeUser
    }

}