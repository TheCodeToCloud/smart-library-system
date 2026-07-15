import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, refreshToken?: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

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
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}