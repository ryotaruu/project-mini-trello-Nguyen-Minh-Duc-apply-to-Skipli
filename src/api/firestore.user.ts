import { doc, setDoc, getDoc, getDocs, collection, where, query } from 'firebase/firestore'
import { firebaseDB } from '../features/auth/firebase'
import type { User as FirebaseUserGithub } from 'firebase/auth'
import type { User as UserTypeEmailCode } from '../types/user'
import type { Board } from '../types/board'

export const saveUserToFirestore = async (user: FirebaseUserGithub) => {
  if (!user.email) return

  const userRef = doc(firebaseDB, 'users', user.uid)
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    provider: user.providerData[0]?.providerId || 'github',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    codeVerify: 'oauth_with_github',
    isAdmin: false
  }, { merge: true })
}

export const saveUserEmailVerifyCode = async (user: UserTypeEmailCode) => {
  const userRef = doc(firebaseDB, 'users', user.uid)
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: user.provider,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    codeVerify: user.codeVerify,
    isAdmin: user.isAdmin
  }, { merge: true })
}

export const getUserFromFirestore = async (uid: string): Promise<UserTypeEmailCode | null> => {
  const docRef = doc(firebaseDB, 'users', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserTypeEmailCode
  } else {
    return null
  }
}

export const getUsersFromFirestore = async (): Promise<UserTypeEmailCode[]> => {
  const usersCol = collection(firebaseDB, 'users')
  const userDocs = await getDocs(usersCol)

  const users: UserTypeEmailCode[] = userDocs.docs.map(doc => ({
    ...(doc.data() as UserTypeEmailCode),
    uid: doc.id
  }))

  return users
}

export const saveBoardToFirestore = async (board: Board) => {
  const boardRef = doc(firebaseDB, 'boards', board.uid)
  await setDoc(boardRef, {
    uid: board.uid,
    name: board.name,
    description: board.description,
    status: board.status,
    members: board.members,
    ownerId: board.ownerId,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt
  }, { merge: true })
}

export const getBoardsByOwnerId = async (ownerId: string): Promise<Board[]> => {
  const boardsRef = collection(firebaseDB, 'boards')
  const q = query(boardsRef, where('ownerId', '==', ownerId))
  const querySnapshot = await getDocs(q)

  const boards: Board[] = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Omit<Board, 'uid'>)
  }))

  return boards
}

export const getBoardFromFirestore = async (uid: string): Promise<Board | null> => {
  const docRef = doc(firebaseDB, 'boards', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as Board
  } else {
    return null
  }
}