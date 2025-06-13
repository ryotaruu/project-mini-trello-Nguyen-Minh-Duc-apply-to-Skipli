import { doc, setDoc, getDoc, getDocs, collection, where, query, deleteDoc } from 'firebase/firestore'
import { firebaseDB } from '../features/auth/firebase'
import type { User as FirebaseUserGithub } from 'firebase/auth'
import type { User as UserTypeEmailCode } from '../types/user'
import type { Board } from '../types/board'
import type { Task } from '../types/task'
import type { Card } from '../types/card'

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

export const saveCardToFirestore = async (card: Card) => {
  const cardRef = doc(firebaseDB, 'cards', card.uid)
  await setDoc(cardRef, {
    uid: card.uid,
    boardUid: card.boardUid,
    ownerId: card.ownerId,
    title: card.title,
    status: card.status,
    tasks: card.tasks,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt
  }, { merge: true })
}

export const getCardsByBoardUid = async (boardUid: string): Promise<Card[]> => {
  const cardsRef = collection(firebaseDB, 'cards')
  const q = query(cardsRef, where('boardUid', '==', boardUid))
  const querySnapshot = await getDocs(q)

  const cards: Card[] = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Omit<Card, 'uid'>)
  }))

  return cards
}

export const getCardFromFirestore = async (uid: string): Promise<Card | null> => {
  const docRef = doc(firebaseDB, 'cards', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as Card
  } else {
    return null
  }
}

export const saveTaskToFirestore = async (task: Task) => {
  const taskRef = doc(firebaseDB, 'tasks', task.uid)
  await setDoc(taskRef, {
    uid: task.uid,
    cardUId: task.cardUId,
    title: task.title,
    description: task.description,
    status: task.status,
    position: task.position,
    createdBy: task.createdBy,
    assignedTo: task.assignedTo,
    dueDate: task.dueDate,
    priority: task.priority,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    ownerId: task.ownerId
  }, { merge: true })
}

export const getTasksByCardUId = async (cardUId: string): Promise<Task[]> => {
  const tasksRef = collection(firebaseDB, 'tasks')
  const q = query(tasksRef, where('cardUId', '==', cardUId))
  const querySnapshot = await getDocs(q)

  const tasks: Task[] = querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Omit<Task, 'uid'>)
  }))

  return tasks
}

export async function getTaskFromFirestore(taskId: string): Promise<Task | null> {
  try {
    const taskRef = doc(firebaseDB, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (taskSnap.exists()) {
      return taskSnap.data() as Task;
    }
    return null;
  } catch (error) {
    console.error('Error getting task:', error);
    return null;
  }
}

export const updateBoardInFirestore = async (board: Board) => {
  const boardRef = doc(firebaseDB, 'boards', board.uid)
  await setDoc(boardRef, {
    ...board,
    updatedAt: new Date().toISOString()
  }, { merge: true })
}

export const deleteBoardFromFirestore = async (boardUid: string) => {
  const boardRef = doc(firebaseDB, 'boards', boardUid)
  await deleteDoc(boardRef)
}