import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { msalConfig } from './authConfig';
import './i18n.js';
import { AuthProvider } from './provider/AuthProvider.jsx';
import './sass/bootstrap-custom.scss';

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MsalProvider instance={msalInstance}>
            <AuthProvider>
                <App />
            </AuthProvider>

            <ToastContainer
                theme="colored"
            />
        </MsalProvider>
    </StrictMode>,
)
