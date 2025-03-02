import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
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

    return (
        <div className="container-fluid px-5">
            <Header />

            <Outlet />
        </div>
    )
}

export default App
