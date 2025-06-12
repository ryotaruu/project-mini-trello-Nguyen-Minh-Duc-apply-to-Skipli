import { useEffect, useRef, useState } from "react"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useUser } from "../contexts/UserContext"
import { getBoardsByOwnerId, getUsersFromFirestore, saveBoardToFirestore } from "../api/firestore.user"
import type { User } from "../types/user"
import MultiSelect from '../components/MultiSelect';
import type { Board } from "../types/board"
import { toast } from "react-toastify"
import { Calendar, MoreHorizontal, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [open, setOpen] = useState(false)
    const formCreateBoard = useRef<HTMLFormElement>(null)
    const { user } = useUser();
    const [users, setUsers] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [boards, setBoards] = useState<Board[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const generateUID = (length = 24) => {
        const array = new Uint8Array(length / 2)
        window.crypto.getRandomValues(array)
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
    }

    const handleCreateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = formCreateBoard.current
        if (!form) return
        const formData = new FormData(form)
        const boardData: Board = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            status: formData.get('status') as 'active' | 'inactive' | 'archived',
            members: selectedUsers,
            ownerId: user?.uid as string,
            uid: generateUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        await saveBoardToFirestore(boardData)
        setSelectedUsers([])
        toast.success('Board created successfully')
        fetchBoards()
    }

    const fetchBoards = async () => {
        if (!user?.uid) return
        const boards = await getBoardsByOwnerId(user.uid)
        setBoards(boards)
    }

    const handleShowCardList = (boardUid: string) => {
        navigate(`/boards/${boardUid}/cards`)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getUsersFromFirestore()
            setUsers(users)
            if (user?.uid) {
                const boards = await getBoardsByOwnerId(user.uid)
                setBoards(boards)
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [user])

    return <>
        <DashboardLayout>
            <div>
                <h4 className="text-2xl font-bold">Welcome to dashboard</h4>
            </div>
            <div className="mt-6 flex justify-between border-b border-gray-200 pb-2">
                <h4 className="text-lg font-bold">Your boards</h4>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => setOpen(true)}>Create board</button>
                <Dialog open={open} onClose={setOpen} className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                            >
                                <form ref={formCreateBoard} onSubmit={handleCreateBoard}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                    Create board
                                                </DialogTitle>
                                                <input type="hidden" name="ownerId" value={user?.uid ?? ''} />
                                                <div className="mt-2">
                                                    <div>
                                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Board name</label>
                                                        <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Board name" required />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <div>
                                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                                        <input type="text" id="description" name="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Board description" required />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <div>
                                                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                                                        <select
                                                            id="status"
                                                            name="status"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            defaultValue=""
                                                        >
                                                            <option value="">Choose a status</option>
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                            <option value="archived">Archived</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <label htmlFor="members" className="block mb-2 text-sm font-medium text-gray-900">Members</label>
                                                    <MultiSelect
                                                        options={users.map(user => ({
                                                            value: user.uid,
                                                            label: user.email + ' - ' + user.provider
                                                        }))}
                                                        value={selectedUsers}
                                                        onChange={setSelectedUsers}
                                                        placeholder="Choose users..."
                                                        searchPlaceholder="Search users..."
                                                        className="mb-4"
                                                        showSelectAll={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            onClick={() => setOpen(false)}
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        >
                                            Create board
                                        </button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setOpen(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div>
                        <span className="text-gray-500 text-sm ml-2">Loading your boards, Please wait...</span>
                    </div>
                ) : (
                    boards.map((board) => (
                        <div
                            key={board.uid}
                            onClick={() => handleShowCardList(board.uid)}
                            className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                        >
                            <div
                                className="h-24 p-4 flex items-end relative"
                                style={{ background: board.status === 'active' ? 'linear-gradient(to right, #00b09b, #96c93d)' : 'linear-gradient(to right, #6a11cb, #2575fc)' }}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                                <h3 className="text-white font-bold text-lg relative z-10 truncate">
                                    {board.name}
                                </h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            <div className="p-4">
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <Users size={14} />
                                        <span>{board.members.length} member{board.members.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span>0 card</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {board.members.slice(0, 3).map((member, index) => (
                                            <img
                                                key={index}
                                                src={users.find(user => user.uid === member)?.photoURL ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                                                alt={users.find(user => user.uid === member)?.email ?? ''}
                                                className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                                title={users.find(user => user.uid === member)?.email + ' - ' + users.find(user => user.uid === member)?.provider}
                                            />
                                        ))}
                                        {board.members.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                +{board.members.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                                        <Calendar size={12} />
                                        <span>{board.updatedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    </>
}