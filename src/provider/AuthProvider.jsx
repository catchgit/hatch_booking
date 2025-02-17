import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Login from "../screens/Login";

// There is no user login
// There is a general code for login that needs to be correct

const AuthContext = createContext(null);

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuthContext must be used within a AuthProvider")
    }

    return context;
}

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [tokenChecked, setTokenChecked] = useState(false);

    // Check for accesstoken in localstorage and validate
    const validateToken = async () => {
        const localToken = localStorage.getItem('bookingAccessToken');

        try {
            const res = await axios.post(import.meta.env.VITE_API, {
                action: 'validateToken',
                token: localToken
            });

            if (res.data.status === 200) {
                setAccessToken(res.data.accessToken);
            } else {
                setAccessToken(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTokenChecked(true);
        }

    }

    useEffect(() => {
        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{
            apiCall: async (data) => {
                if (!data.action) {
                    console.warn("No action provided");
                    return;
                }

                try {
                    const response = await axios({
                        method: 'post',
                        url: import.meta.env.VITE_API,
                        data: {
                            token: accessToken,
                            ...data
                        }
                    });

                    if (response.status === 200) {
                        // Check for unauthorized acces
                        if (response.data.status === 401) {
                            setAccessToken(null);
                            return false;
                        }

                        return response.data;
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            updateAccessToken: (token) => {
                setAccessToken(token);
            }
        }}>
            {!tokenChecked ? null : !accessToken ? <Login /> : children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuthContext };

