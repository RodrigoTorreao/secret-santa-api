import { generateDrawPairs } from './draw.utils'

describe('generateDrawPairs', () => {
    it('should generate valid draw pairs', () => {
        const participants = ["1", "2", "3"]

        const result = generateDrawPairs(participants)

        expect(result).toHaveLength(participants.length)

        for (const pair of result) {
            expect(pair.giverId).not.toEqual(pair.receiverId)
        }
    })

    it('should throw if less than 2 participants', () => {
        expect(() =>
            generateDrawPairs(["1"]),
        ).toThrow()
    })
})