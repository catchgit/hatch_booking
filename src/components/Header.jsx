import { format } from "date-fns";
import Button from "./Button";
import { nb } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useConfigProvider } from "../provider/ConfigProvider";

const Header = (props) => {
    const { showTime = true } = props;
    const [currentTime, setCurrentTime] = useState(new Date());
    const { selectedRoom } = useConfigProvider();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1 * 1000); // Update every second

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="row py-3">
            <div className="col">
                <h1 className="text-white">{selectedRoom?.name ?? "Velg rom"}</h1>
            </div>
            <div className="col-auto">
                <div className="d-flex align-items-center gap-3">
                    {showTime ? (
                        <>
                            <h4 className="mb-0">{format(currentTime, 'HH:mm')}</h4>
                            <h4 className="mb-0 fw-light text-white-50 text-capitalize">{format(currentTime, 'EEEE d. MMMM yyyy', { locale: nb })}</h4>
                        </>
                    ) : null}

                    {location.pathname === '/' && selectedRoom ? (
                        <Button
                            text="Alle rom"
                            type="white-25"
                            leftIcon="xmark"
                            onClick={() => navigate(`/${selectedRoom.email}`)}
                        />
                    ) : selectedRoom ? (
                        <Button
                            text="Alle rom"
                            type="white-5"
                            leftIcon="calendars"
                            onClick={() => navigate('/')}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Header;