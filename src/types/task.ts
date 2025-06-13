export type Task = {
    uid: string
    cardUId: string
    title: string
    ownerId: string
    description: string
    status: 'new' | 'in_progress' | 'completed' | 'cancelled'
    position: number
    createdAt: string
    updatedAt: string
    createdBy: string
    assignedTo: string
    dueDate: string
    priority: 'low' | 'medium' | 'high'
}