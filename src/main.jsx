import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'swiper/css';
import App from './App.jsx';
import { msalConfig } from './authConfig';
import './i18n.js';
import { AuthProvider } from './provider/AuthProvider.jsx';
import { ConfigProvider } from './provider/ConfigProvider.jsx';
import './sass/bootstrap-custom.scss';
library.add(fas, far, fal, fad)

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
    <MsalProvider instance={msalInstance}>
        <ConfigProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfigProvider>

        <ToastContainer
            theme="colored"
        />
    </MsalProvider>
)
