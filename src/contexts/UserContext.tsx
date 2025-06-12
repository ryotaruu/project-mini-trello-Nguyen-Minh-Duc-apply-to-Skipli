// src/contexts/UserContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/user';
import { getUserFromFirestore } from '../api/firestore.user';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../features/auth/firebase';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const uid = localStorage.getItem('uid') ?? null;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userData = await getUserFromFirestore(user.uid);
                    setUser(userData);
                } else if (uid) {
                    const userData = await getUserFromFirestore(uid);
                    setUser(userData);
                } else {
                    navigate('/sign-in');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/sign-in');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};