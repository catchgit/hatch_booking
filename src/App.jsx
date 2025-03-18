import { BrowserRouter, Outlet, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Rooms from './screens/Rooms';
import Admin from './screens/Admin';
import Header from './components/Header';
import Room from './screens/Room';
import { BookingContainer, BookingDetails, EnterPin, SelectUser } from './screens/Booking';
import { useConfigProvider } from './provider/ConfigProvider';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}>
                {/* Overview of all rooms */}
                <Route index element={<Rooms />} />

                {/* Individual room routes */}
                <Route path=":roomEmail" element={<ProtectedRoute><Room /></ProtectedRoute>} />

                {/* Booking form routes */}
                <Route path=":roomEmail/booking" element={<ProtectedRoute><BookingContainer /></ProtectedRoute>}>
                    <Route index element={<SelectUser />} />
                    <Route path="enter-pin" element={<EnterPin />} />
                    <Route path="details" element={<BookingDetails />} />
                </Route>

                <Route path="admin" element={<Admin />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

const ProtectedRoute = ({ children }) => {
    const { selectedRoom } = useConfigProvider();
    
    if (!selectedRoom) {
        return <Navigate to="/" replace />;
    }

    return children;
};

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
