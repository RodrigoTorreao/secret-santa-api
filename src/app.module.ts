import { Module } from '@nestjs/common'
import { DatabaseModule } from './infra/database/database.module'
import { AuthModule } from './auth/auth.module'
import { GroupsModule } from './groups/groups.module'
import { UsersModule } from './users/users.module'
import { DrawModule } from './draw/draw.module'
import { NotificationsModule } from './notifications/notifications.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GroupsModule,
    DrawModule,
    NotificationsModule,
    DatabaseModule
  ],
})
export class AppModule {}