import { useRef, useState } from "react";
import { LogoProject } from "../../components/logo-project";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const formSignUp = useRef<HTMLFormElement>(null)
    const [statusLoading, setStatusLoading] = useState(false)
    const navigate = useNavigate()

    const handleSendVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
        setStatusLoading(true)

        e.preventDefault()

        const form = formSignUp.current
        if (!form) return
        const formData = new FormData(form)

        const post = await fetch('http://localhost:3000/auth/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        const response = await post.json()
        const message = response.message
        if (message === 'Verification code sent') {
            setStatusLoading(false)
            navigate('/alert-message-send-email')
        }
    }

    return <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <LogoProject />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Get verify code to login with your email
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" ref={formSignUp} onSubmit={handleSendVerificationCode}>
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
                        <label htmlFor="" className="block text-sm/6 font-medium text-gray-900">
                            For security reasons, I will use another one of my emails (kenshindo18@gmail.com) to send the verification code to the email you provided.
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${statusLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={statusLoading}
                        >
                            {statusLoading ? <div className="flex items-center justify-center gap-2"><span className="text-white">Please, waiting some one second ...</span> <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg></div> : 'Send verification code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}