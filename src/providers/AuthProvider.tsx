import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from '../firebase/firebase';

type ContextType = {
    currentUser: User | null;
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

    const testSignIn = async () => {
        signInWithEmailAndPassword(auth, '01henrikb@gmail.com', 'test123')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setCurrentUser(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, ": ", errorMessage)
            })
    }

    useEffect(() => {
        testSignIn();
    }, [])

    return (
        <AuthContext.Provider value={{
            currentUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { useAuthContext, AuthProvider };    