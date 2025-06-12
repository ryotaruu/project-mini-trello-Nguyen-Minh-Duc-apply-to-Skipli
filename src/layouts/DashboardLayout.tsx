import type { ChildrenElementProps } from "../types/chilren-element-props"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from 'firebase/auth'
import { auth } from "../features/auth/firebase"
import { LogoProject } from "../components/logo-project"
import { useUser } from "../contexts/UserContext"

export const DashboardLayout = ({ children }: ChildrenElementProps) => {
    const navigate = useNavigate()
    const { user, loading } = useUser()
    const [isOpenSidebar, setIsOpenSidebar] = useState(true)

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (!user) {
        navigate('/sign-in')
    }

    const handleSignOut = async () => {
        await signOut(auth)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('uid')
        navigate('/sign-in')
    }

    const handleToggleSidebar = () => {
        setIsOpenSidebar(!isOpenSidebar)
    }

    return <div>
        <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out ${isOpenSidebar ? 'w-64 translate-x-0' : '-translate-x-full w-64'} h-screen`} aria-label="Sidebar">
            <div className={`h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800`}>
                <ul className="space-y-2 font-medium">
                    <li>
                        <LogoProject />
                        <button
                            onClick={() => setIsOpenSidebar(false)}
                            className={`absolute -right-12 top-10 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden ${isOpenSidebar ? 'block' : 'hidden'}`}
                            aria-label="Close sidebar"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/dashboard')} className={`w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/dashboard' ? 'bg-blue-100 dark:bg-blue-700' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                            </svg>
                            <span className="ms-3">Dashboard</span>
                        </button>
                    </li>
                    {user?.isAdmin ? <li>
                        <button onClick={() => navigate('/users')} className={`w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/users' ? 'bg-blue-100 dark:bg-blue-700' : ''}`}>
                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-white group-hover:text-white dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                            </svg>
                            <span className="ms-3">List users</span>
                        </button>
                    </li> : null}
                </ul>
            </div>
        </aside>
        <div className={`${isOpenSidebar ? 'sm:ml-64 ' : 'sm:ml-0'}`}>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
                    <button onClick={handleToggleSidebar} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <button className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-white-500" aria-current="page">
                                    Welcome, {user?.displayName ?? ''}
                                </button>
                            </li>
                            <li>
                                <Menu as="div" className="relative">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                alt=""
                                                src={user?.photoURL ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
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
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="p-4 rounded-lg overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
}
