import { Link } from "react-router-dom";
import { LogoProject } from "./logo-project";
import ImageEmailSendCode from '../assets/mini-trello-email-send-code.png' 

export default function AlertMessageSendEmail() {
    return (
        <div className="m-auto w-150 p-5">
            <LogoProject />
            <img src={ImageEmailSendCode} alt="Image email send code" className="w-full border-2 mt-6 border-gray-300 rounded-md" />
            <p className="text-center text-2xl font-bold mt-6 mb-6">I had sent the verification code to your email, please check your email inbox or spam folder. Thank you!</p>
            <p className="text-center text-2xl font-bold mt-6 mb-6">The code will expire in 20 minutes.</p>
            <Link to="/sign-in" className="w-full flex items-center justify-center text-center m-auto rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Back to Sign In
            </Link>
        </div>
    )
}