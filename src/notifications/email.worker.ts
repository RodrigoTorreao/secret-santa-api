import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { EmailService } from './email.service'
import { SendEmailJob } from './email.job'
import { EMAIL_QUEUE } from '../infra/queue/queues'

@Processor(EMAIL_QUEUE)
export class EmailWorker extends WorkerHost {
    private readonly logger = new Logger(EmailWorker.name)

    constructor(
        private readonly emailService: EmailService,
    ) {
        super()
    }

    async process(job: Job<SendEmailJob>): Promise<void> {
        this.logger.log(
            `Processing email job ${job.id} (attempt ${job.attemptsMade + 1})`,
        )

        try {
            await this.emailService.send({
                to: job.data.to,
                subject: job.data.subject,
                body: job.data.body,
            })

            this.logger.log(`Email job ${job.id} completed`)
        } catch (error) {
            this.logger.error(
                `Email job ${job.id} failed`,
                error instanceof Error ? error.stack : undefined,
            )

            throw error
        }
    }
}