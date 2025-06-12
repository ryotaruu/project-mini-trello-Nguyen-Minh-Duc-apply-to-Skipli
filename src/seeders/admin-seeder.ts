'use client'
import { saveUserEmailVerifyCode } from "../api/firestore.user";

export default function AdminSeeder() {
    fetch('http://localhost:3000/auth/admin-seeder', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(data => {
        saveUserEmailVerifyCode(data)
    })
    return 'Created admin user successfully'
}