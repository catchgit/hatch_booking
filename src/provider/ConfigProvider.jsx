import { createContext, ReactNode, useContext, useState } from "react";

const ConfigContext = createContext(null);

const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (context === null) {
        throw new Error("useConfigContext must be used within a ConfigProvider")
    }

    return context;
}

const ConfigProvider = ({ children }) => {
    const [rooms, setRooms] = useState(null);

    return (
        <ConfigContext.Provider value={{
            rooms,
            updateRooms: (value) => {
                setRooms(value);
            }
        }}>
            {children}
        </ConfigContext.Provider>
    )
}

export { useConfigContext, ConfigProvider };