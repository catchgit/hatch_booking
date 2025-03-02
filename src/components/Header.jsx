import { format } from "date-fns";
import Button from "./Button";
import { nb } from "date-fns/locale";
import { useState, useEffect } from "react";

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

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
                <h1 className="text-white">Green room</h1>
            </div>
            <div className="col-auto">
                <div className="d-flex align-items-center gap-3">
                    <h4 className="mb-0">{format(currentTime, 'HH:mm')}</h4>
                    <h4 className="mb-0 fw-light text-white-50 text-capitalize">{format(currentTime, 'EEEE d. MMMM yyyy', { locale: nb })}</h4>
                    <Button
                        text="Alle rom"
                        type="white-5"
                        leftIcon="calendars"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;