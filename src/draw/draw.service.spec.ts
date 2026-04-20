import { DrawService } from './draw.service'
import { GroupStatus } from '@prisma/client'
import { Queue } from 'bullmq'

describe('DrawService', () => {
    let service: DrawService

    const prismaMock: {
        group: {
            findUnique: jest.Mock
            update: jest.Mock
        }
        drawResult: {
            createMany: jest.Mock
        }
        $transaction: jest.Mock
    } = {
        group: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        drawResult: {
            createMany: jest.fn(),
        },
        $transaction: jest.fn(),
    }

    const emailQueueMock: Partial<Queue> = {
        add: jest.fn(),
    }

    beforeEach(() => {
        prismaMock.$transaction.mockImplementation(
            async (cb: (tx: typeof prismaMock) => unknown) => {
                return cb(prismaMock)
            }
        )

        service = new DrawService(
            prismaMock as any,
            emailQueueMock as Queue
        )
    })

    it('should not allow draw if group is already DRAWN', async () => {
        prismaMock.group.findUnique.mockResolvedValue({
            id: 'group-1',
            status: GroupStatus.DRAWN,
            participants: [],
        })

        await expect(
            service.draw('group-1', 'user-1')
        ).rejects.toThrow()
    })
})