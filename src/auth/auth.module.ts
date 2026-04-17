import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '1h',
        },
        }),
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
