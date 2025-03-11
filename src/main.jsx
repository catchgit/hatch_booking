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
import 'swiper/css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { ConfigProvider } from './provider/ConfigProvider.jsx';
library.add(fas, far, fal, fad)

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
    <StrictMode>
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
    </StrictMode>,
)
