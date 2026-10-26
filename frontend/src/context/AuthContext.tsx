import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    getCurrentUser,
    login as apiLogin,
    logout as apiLogout,
    type LoginResponse,
    type User
} from "../services/authApi";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<LoginResponse>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function logout() {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    }

    async function login(
        email: string,
        password: string,
        rememberMe: boolean
    ): Promise<LoginResponse> {
        const response = await apiLogin(email, password, rememberMe);

        if (!response.user) {
            throw new Error("Invalid login response.");
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);
        response.user = currentUser;

        return response;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}
