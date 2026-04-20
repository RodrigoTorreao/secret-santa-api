import { Module } from '@nestjs/common'
import { DatabaseModule } from './infra/database/database.module'
import { AuthModule } from './auth/auth.module'
import { GroupsModule } from './groups/groups.module'
import { UsersModule } from './users/users.module'
import { DrawModule } from './draw/draw.module'
import { QueueModule } from './infra/queue/queue.module'
import { NotificationsModule } from './notifications/notifications.module'
import { LoggerModule } from './infra/logger/logger.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GroupsModule,
    DrawModule,
    NotificationsModule,
    DatabaseModule, 
    QueueModule,
    LoggerModule,

  ],
})
export class AppModule {}