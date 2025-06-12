import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import SignUp from "../features/auth/Signup"
import Dashboard from "../pages/Dashboard"
import AlertMessageSendEmail from "../components/AlertMessageSendEmail"
import SignIn from "../features/auth/SignIn"
import AdminSeeder from "../seeders/admin-seeder"
import { UserProvider } from "../contexts/UserContext"
import CardList from "../pages/CardList"

export default function AppRouter() {
    const isAuthenticated = !!localStorage.getItem('accessToken')

    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/sign-in'} />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/alert-message-send-email" element={<AlertMessageSendEmail />} />
                    <Route path="/admin-seeder" element={<AdminSeeder />} />
                    <Route path="/boards/:boardUid/cards" element={<CardList />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    )
}