import './App.css'
import Auth from './Auth'
import { AuthProvider } from './providers/AuthProvider'

function App() {

    return (
        <AuthProvider>
            <Auth />
        </AuthProvider>
    )
}

export default App
