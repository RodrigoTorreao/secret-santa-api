import { Module } from '@nestjs/common';
import { UsersService } from './users.service'
import { UsersController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';


@Module({
     providers: [UsersService],
     controllers: [UsersController],
     exports: [UsersService],
})
export class UsersModule {}
