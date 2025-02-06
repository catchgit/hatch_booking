import { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Calendar from "./screens/Calendar";


const Navigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Calendar />}>
                    <Route path="/oversikt" element={<Calendar />}>

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