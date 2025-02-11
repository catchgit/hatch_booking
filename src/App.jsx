import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './screens/Dashboard';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />}>
                <Route index element={<Dashboard />}>

                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
);

const Main = () => {

    return (
        <Outlet />
    )
}

export default App
