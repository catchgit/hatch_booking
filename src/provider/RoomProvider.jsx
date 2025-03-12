import { createContext, useContext } from "react";

const RoomContext = createContext(null);

const useRoomContext = () => {
    const context = useContext(RoomContext);
    if (context === null) { 
        throw new Error("useRoomContext must be used within a RoomProvider")
    }
    return context;
}

const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState(null);

    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {children}
        </RoomContext.Provider>
    )
}

export { useRoomContext, RoomProvider };