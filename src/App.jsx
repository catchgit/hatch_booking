import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Rooms from './screens/Rooms';
import Header from './components/Header';
import Room from './screens/Room';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}>
                <Route index element={<Rooms />} />
                <Route path=":roomId" element={<Room />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

const Main = () => {
    const location = useLocation();
    
    // Determine which routes should show the time
    const shouldShowTime = () => {
        // Add routes where you want to hide the time
        const routesWithoutTime = ['/', '/another-route'];
        return !routesWithoutTime.includes(location.pathname);
    };

    return (
        <div className="container-fluid px-5">
            <Header showTime={shouldShowTime()} />
            <Outlet />
        </div>
    )
}

export default App
