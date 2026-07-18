import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../data/api";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    full_name?: string;
    profile_picture?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserProfile | null;
    login: (token: string, refreshToken?: string) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );
    const [user, setUser] = useState<UserProfile | null>(null);

    const [isLoading, setIsLoading] = useState(isAuthenticated);

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/accounts/me/");
            setUser(res.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUser();
        }
    }, [isAuthenticated]);

    const login = (token: string, refreshToken?: string) => {
        localStorage.setItem("token", token);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}