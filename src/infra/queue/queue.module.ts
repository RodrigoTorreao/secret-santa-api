import { Global, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { EMAIL_QUEUE, EMAIL_DLQ } from './queues'

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST ?? 'redis',
                port: Number(process.env.REDIS_PORT ?? 6379),
            },
        }),
        BullModule.registerQueue({
            name: EMAIL_QUEUE,
            defaultJobOptions: {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 3000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            },
        }),
        BullModule.registerQueue({
            name: EMAIL_DLQ,
        }),
    ],
    exports: [BullModule],
})
export class QueueModule {}