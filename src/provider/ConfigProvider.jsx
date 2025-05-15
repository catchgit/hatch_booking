import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { FullscreenLoader } from '../screens/FullscreenLoader';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const [roomsLoaded, setRoomsLoaded] = useState(false);

    const apiCall = async (data) => {
        if (!data.action) {
            console.warn("No action provided");
            return;
        }

        try {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API}?action=${data.action}`,
                data: {
                    token: localStorage.getItem('bookingAccessToken'),
                    ...data
                }
            });

            if (response.status === 200) {
                // Check for unauthorized acces
                if (response.data.status === 401) {
                    setAccessToken(null);
                    return false;
                }

                return response.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getUsers = async () => {
        const response = await apiCall({ action: 'getUsers' });
        if (response?.data) {
            setUsers(response.data);
            setUsersLoaded(true);
        }
    }

    const getRooms = async () => {
        const response = await apiCall({ action: "getRooms" });
        if (response?.status === 200) {
            setRooms(response.data);
            setRoomsLoaded(true);
        }
    };

    useEffect(() => {
        getUsers();
        getRooms();
    }, []);

    useEffect(() => {
        if (usersLoaded && roomsLoaded) {
            setLoading(false);
        }
    }, [usersLoaded, roomsLoaded]);

    return (
        <ConfigContext.Provider value={{
            users,
            selectedRoom,
            rooms,
            updateSelectedRoom: (room, email) => {
                setSelectedRoom({
                    name: room,
                    email: email
                });
            },
            updateUsers: (users) => {
                setUsers(users);
            }
        }}>
            {loading ? <FullscreenLoader /> : children}
        </ConfigContext.Provider>
    );
};

export const useConfigProvider = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfigProvider must be used within a ConfigProvider');
    }
    return context;
};
