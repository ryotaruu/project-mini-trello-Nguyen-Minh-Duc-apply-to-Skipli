export interface Board {
    uid: string,
    name: string,
    description: string,
    ownerId: string,
    createdAt: string,
    updatedAt: string,          
    members: string[],
    status: 'active' | 'inactive' | 'archived'
}