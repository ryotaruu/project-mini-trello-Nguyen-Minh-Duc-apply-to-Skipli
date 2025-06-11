import { doc, setDoc, getDoc } from 'firebase/firestore'
import { firebaseDB } from '../features/auth/firebase'
import type { User } from 'firebase/auth'
import type { AppUser } from '../types/app-user'

export const saveUserToFirestore = async (user: User) => {
  if (!user.email) return

  const userRef = doc(firebaseDB, 'users', user.uid)
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    provider: user.providerData[0]?.providerId || 'github',
    lastLogin: new Date().toISOString()
  }, { merge: true })
}

export const saveUserEmailVerifyCode = async (user: AppUser) => {
  const userRef = doc(firebaseDB, 'users', user.uid)
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider: user.provider,
    lastLogin: new Date().toISOString()
  }, { merge: true })
}

export const getUserFromFirestore = async (uid: string): Promise<User | null> => {
  const docRef = doc(firebaseDB, 'users', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as User
  } else {
    return null
  }
}