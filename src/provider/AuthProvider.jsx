import { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, graphApiScopes } from "../authConfig";

const AuthContext = createContext(null);

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuthContext must be used within a AuthProvider")
    }

    return context;
}

const msalInstance = new PublicClientApplication(msalConfig);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize MSAL instance
    useEffect(() => {
        msalInstance.initialize()
            .then(() => {
                setIsInitialized(true);
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    const currentAccount = accounts[0];
                    msalInstance
                        .acquireTokenSilent({ scopes: graphApiScopes, account: currentAccount })
                        .then((response) => {
                            setUser(currentAccount);
                            setAccessToken(response.accessToken);
                        })
                        .catch((error) => {
                            console.error('Error acquiring token silently', error);
                        });
                }
            })
            .catch((error) => {
                console.error("Error initializing MSAL:", error);
            });
    }, []);

    if (!isInitialized) {
        return null; // Or a loading spinner if you prefer
    }

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            signIn: () => {
                msalInstance
                    .loginPopup({ scopes: graphApiScopes })
                    .then((response) => {
                        setUser(response.account);
                        setAccessToken(response.accessToken);
                    })
                    .catch((error) => {
                        console.error('Sign-in error', error);
                    });
            },
            signOut: () => {
                msalInstance.logout();
                setUser(null);
                setAccessToken(null);
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, useAuthContext };
