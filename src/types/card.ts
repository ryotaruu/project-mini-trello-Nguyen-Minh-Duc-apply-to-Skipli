export interface Card {
    uid: string
    boardUid: string
    ownerId: string
    title: string
    status: 'new' | 'in_progress' | 'completed' | 'cancelled'
    tasks: string[]
    createdAt: string
    updatedAt: string
    expiresAt: string
}