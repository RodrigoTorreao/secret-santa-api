import { EmailWorker } from './email.worker'

describe('EmailWorker', () => {
    it('should throw if email fails so BullMQ can retry', async () => {
        const emailServiceMock = {
            send: jest.fn().mockRejectedValue(new Error('Email failed')),
        }

        const worker = new EmailWorker(emailServiceMock as any)

        const fakeJob = {
            id: 1,
            attemptsMade: 0,
            data: {
                to: 'test@test.com',
                subject: 'Test',
                body: 'Test',
            },
        } as any // 👈 proposital (não tipamos Job real)

        await expect(worker.process(fakeJob)).rejects.toThrow('Email failed')
    })
})