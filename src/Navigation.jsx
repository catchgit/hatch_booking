import { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./screens/Dashboard";


const Navigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/oversikt" element={<Dashboard />}>

                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const App = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/oversikt')
        }
    }, [])

    return (
        <Outlet />
    )
}

export default Navigation;