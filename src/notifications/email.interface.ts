export interface SendEmailInput {
    to: string
    subject: string
    body: string
}

export interface EmailServiceInterface {
    send(input: SendEmailInput): Promise<void>
}