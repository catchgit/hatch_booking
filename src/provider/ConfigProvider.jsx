import { createContext, useContext, useState } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);

    return (
        <ConfigContext.Provider value={{
            selectedRoom,
            updateSelectedRoom: (room, email) => {
                setSelectedRoom({
                    name: room,
                    email: email
                });
            }
        }}>
            {children}
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
