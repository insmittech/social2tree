import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import client from '../api/client';
import { UserProfile } from '../../types';

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAdmin: boolean;
    login: (user: UserProfile) => void;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<UserProfile>) => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const response = await client.get('/auth/me.php');
            if (response.data.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData: UserProfile) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await client.post('/auth/logout.php');
        } catch (err) {
            console.error('Logout error:', err);
        }
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updates: Partial<UserProfile>) => {
        if (user) {
            setUser({ ...user, ...updates });
        }
    };

    const refreshProfile = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isAdmin: user?.role === 'admin',
            login,
            logout,
            updateUser,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
