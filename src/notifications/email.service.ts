import { Injectable, Logger } from '@nestjs/common'
import { EmailServiceInterface, SendEmailInput } from './email.interface'

@Injectable()
export class EmailService implements EmailServiceInterface {
    private readonly logger = new Logger(EmailService.name)

    async send(input: SendEmailInput): Promise<void> {
        this.logger.log(`Sending email to ${input.to}`)

        await this.simulateNetworkLatency()

        if (this.shouldFail()) {
            this.logger.error(`Failed to send email to ${input.to}`)
            throw new Error('Email provider error')
        }

        this.logger.log(`Email successfully sent to ${input.to}`)
    }

    private async simulateNetworkLatency(): Promise<void> {
        await new Promise(resolve =>
            setTimeout(resolve, 300),
        )
    }

    private shouldFail(): boolean {
        return Math.random() < 0.2
    }
}