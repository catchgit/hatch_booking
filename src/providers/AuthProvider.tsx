import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from '../firebase/firebase';
import LoadingScreen from "../screens/LoadingScreen";

type ContextType = {
    currentUser: User | null;
    login: (username: string, password: string) => Promise<{ status: number; message: string }>;
    signOut: () => void;
}

const AuthContext = createContext<ContextType | null>(null);

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuthContext must be used within a AuthProvider")
    }

    return context;
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            login: async (username: string, password: string) => {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, username, password);
                    const user = userCredential.user;
                    setCurrentUser(user);

                    return { status: 200, message: "Login successful", user };
                } catch (error) {
                    if (error instanceof Error) {
                        console.error(error.message);
                    }

                    return { status: 400, message: "Login failed" };
                }
            },
            signOut: () => {
                signOut(auth)
                    .then(() => setCurrentUser(null))
                    .catch((error) => console.error("Sign-out error: ", error));
            }
        }}>
            {!loading ? children : <LoadingScreen />}
        </AuthContext.Provider>
    )
}

export { useAuthContext, AuthProvider };    