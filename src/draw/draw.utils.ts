export interface DrawPair {
  giverId: string
  receiverId: string
}

export function generateDrawPairs(userIds: string[]): DrawPair[] {
  if (userIds.length < 2) {
    throw new Error('At least 2 participants are required')
  }

  const shuffled = [...userIds]

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.map((giverId, index) => ({
    giverId,
    receiverId:
      index === shuffled.length - 1
        ? shuffled[0]
        : shuffled[index + 1],
  }))
}