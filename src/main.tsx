import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ConfigProvider } from './providers/ConfigProvider.tsx'
import './sass/bootstrap-custom.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './i18n';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider>
            <App />
        </ConfigProvider>
    </StrictMode>,
)
