import { PublicClientApplication } from '@azure/msal-browser';
import './App.css'
import { msalConfig } from './authConfig';
import { MsalProvider } from '@azure/msal-react';
import { AuthProvider } from './provider/AuthProvider';
import Auth from './Auth';

const msalInstance = new PublicClientApplication(msalConfig);

const App = () => (
    <MsalProvider instance={msalInstance}>
        <AuthProvider>
            <Auth />
        </AuthProvider>
    </MsalProvider>
)

export default App
