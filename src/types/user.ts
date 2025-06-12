export interface User {
    uid: string
    email: string
    displayName: string
    photoURL: string | null
    createdAt: string
    lastLoginAt: string
    provider: string
    codeVerify: string
    isAdmin: boolean
}