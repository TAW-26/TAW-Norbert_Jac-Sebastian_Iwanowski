import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    nickname: string;
    dateOfBirth: string;
    avatarUrl: string | null;
    createdAt: string;

    pace?: string;
    interests?: string;
    diet?: string;
    transport?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    updateUser: (newData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/users/me');
            setUser(response.data.user);
        } catch (error) {
            console.error("Sesja wygasła lub błąd tokena:", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        checkAuth();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (newData: Partial<User>) => {
        setUser(prevUser => prevUser ? { ...prevUser, ...newData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth musi być użyte wewnątrz AuthProvider');
    }
    return context;
};