import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import SignUp from "../features/auth/Signup"
import Dashboard from "../pages/Dashboard"
import AlertMessageSendEmail from "../components/AlertMessageSendEmail"
import SignIn from "../features/auth/SignIn"

export default function AppRouter() {
    const isAuthenticated = !!localStorage.getItem('accessToken')

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/sign-in'} />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/alert-message-send-email" element={<AlertMessageSendEmail />} />
            </Routes>
        </BrowserRouter>
    )
}