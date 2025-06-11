import { useNavigate } from "react-router-dom"
import { LogoProject } from "../../components/logo-project"
import GitHubLogo from "../../assets/github.svg"
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from "./firebase"
import { saveUserEmailVerifyCode, saveUserToFirestore } from "../../api/firestore.user"
import { useRef } from "react"
import type { AppUser } from "../../types/app-user"
import { ToastContainer } from 'react-toastify'
import { ToastReactNotify } from "../../components/ToastReactNotify"

export default function SignIn() {
    const navigate = useNavigate()
    const formLogin = useRef<HTMLFormElement>(null)

    const handleSignup = () => {
        navigate('/sign-up')
    }

    const handleGitHubLogin = async () => {
        try {
            const provider = new GithubAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const token = await result.user.getIdToken()
            localStorage.setItem('accessToken', token)
            await saveUserToFirestore(result.user)
            navigate('/dashboard')
        } catch (error) {
            console.log(error);
            alert('GitHub login failed.')
        }
    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = formLogin.current
        if (!form) return
        const formData = new FormData(form)

        try {
            const post = await fetch('http://localhost:3000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            const response = await post.json()
            console.log(response);
            const message = response.message ?? null;
            if (message === 'The email you entered and the code do not match my data. Please get a new authentication code and try again') {
                ToastReactNotify({ message, type: 'error' })
                return
            } else if (message === 'Code expired please register again') {
                ToastReactNotify({ message, type: 'error' })
                return
            } else if (message === 'Verification code is not match') {
                ToastReactNotify({ message, type: 'error' })
                return
            } else {
                localStorage.setItem('accessToken', response.accessToken)
                localStorage.setItem('uid', response.uid)
                const userData: AppUser = {
                    uid: response.uid,
                    email: response.email,
                    displayName: response.displayName,
                    photoURL: response.photoURL,
                    provider: 'email-verify-code'
                }
                await saveUserEmailVerifyCode(userData)
                navigate('/dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <LogoProject />
                <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" ref={formLogin} onSubmit={handleSignIn}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>

                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="code" className="block text-sm/6 font-medium text-gray-900">
                                Code verify
                            </label>
                        </div>

                        <div className="mt-2">
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                autoComplete="current-code"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="text-sm">
                        <p>For each login session, you must obtain a new authentication code to sign in; I will still keep your information in the database.</p>
                    </div>

                    <div className="text-sm">
                        <span>Get code verify with your email here</span>

                        <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2 cursor-pointer" onClick={handleSignup}>
                            Get verify code!
                        </button>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        <div className="col-span-3">
                            <button
                                type="submit"
                                className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in with code verify
                            </button>
                        </div>

                        <div className="col-span-2">
                            <button
                                type="button"
                                className="w-full rounded-md border border-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-indigo-500 flex" onClick={handleGitHubLogin}
                            >
                                <img src={GitHubLogo} alt="" className="w-5 h-5 bg-white rounded-full mt-[0.5px]" />

                                <span className="ml-3">
                                    With Github
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <ToastContainer />
    </>
}