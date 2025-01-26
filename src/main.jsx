import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './sass/bootstrap-custom.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './i18n.js';
import { ConfigProvider } from './provider/ConfigProvider.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider>
            <App />
        </ConfigProvider>
    </StrictMode>,
)
