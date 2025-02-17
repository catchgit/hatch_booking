import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Rooms from './screens/Rooms';
import Header from './components/Header';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}>
                <Route index element={<Rooms />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

const Main = () => {

    return (
        <div className="container">
            <Header />

            <Outlet />
        </div>
    )
}

export default App
