import type { ChildrenElementProps } from "../types/chilren-element-props"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { onAuthStateChanged, type User, signOut } from 'firebase/auth'
import { auth } from "../features/auth/firebase"
import { getUserFromFirestore } from "../api/firestore.user"

export const DashboardLayout = ({ children }: ChildrenElementProps) => {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)

    const handleSignOut = async () => {
        await signOut(auth)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('uid')
        navigate('/sign-in')
    }

    useEffect(() => {
        const uid = localStorage.getItem('uid') ?? null
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await getUserFromFirestore(user.uid)
                setUser(userData)
            } else if (uid) {
                const userData = await getUserFromFirestore(uid)
                setUser(userData)
            } else {
                navigate('/sign-in')
            }
        })
        return () => unsubscribe()
    }, [navigate])

    return user ? (<div className="flex h-screen">
        <div className="flex flex-col flex-1">
            <nav className="flex justify-between bg-white shadow px-4 py-3">
                <Link to={'/'}>
                    <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Mini Trello
                    </h3>
                </Link>

                <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                                alt=""
                                src={user.photoURL ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                className="size-8 rounded-full"
                            />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                        <MenuItem>
                            <button type="button" className="block w-full text-start px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden" onClick={handleSignOut}
                            >
                                Sign out
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </nav>

            <main className="flex-1 p-6 bg-gray-100">
                <h3>Welcome {user.displayName} to Mini Trello</h3>
                {children}
            </main>
        </div>
    </div>) : (<div>Please watting ...</div>)
}
