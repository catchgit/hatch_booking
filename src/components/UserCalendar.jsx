import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../provider/AuthProvider";

const norwegianMonths = [
    "Januar", "Februar", "Mars", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Desember"
];

const UserCalendar = ({ user }) => {
    const { apiCall } = useAuthContext();
    const [bookings, setBookings] = useState({});
    const [monthOffset, setMonthOffset] = useState(0);

    const getBookings = async () => {
        try {
            const res = await apiCall({
                action: 'getUserBookings',
                email: user
            });

            if (res.status === 200) {
                setBookings(res.data);
            } else {
                setBookings({});
                toast.error("Kunne ikke hente bookinger");
            }
        } catch (error) {
            toast.error("En feil oppstod under henting av bookinger");
            setBookings({});
        }
    };

    const currentMonthBookings = useMemo(() => {
        if (!Array.isArray(bookings)) return [];

        const today = new Date();
        const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);

        return bookings.filter((b) => {
            const bookingDate = new Date(b.date);
            return (
                bookingDate.getMonth() === targetMonth.getMonth() &&
                bookingDate.getFullYear() === targetMonth.getFullYear()
            );
        });
    }, [bookings, monthOffset]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const getCurrentMonthTitle = () => {
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() + monthOffset);
        return `${norwegianMonths[refDate.getMonth()]} ${refDate.getFullYear()}`;
    };

    const getColumnTotals = (column) => {
        return currentMonthBookings.reduce((sum, b) => sum + (b[column] || 0), 0);
    };

    const getFormattedTotal = (column) => {
        const total = getColumnTotals(column);
        return total > 0 ? `${total}t` : "";
    };

    useEffect(() => {
        getBookings();
    }, [user]);

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center mb-2">
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setMonthOffset((prev) => prev - 1)}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h6 className="mx-3" style={{ fontWeight: "bold", color: "#6f42c1" }}>
                    {getCurrentMonthTitle()}
                </h6>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setMonthOffset((prev) => prev + 1)}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            <table className="table table-sm table-bordered text-center align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Dato</th>
                        <th>Green Room</th>
                        <th>Yellow Room</th>
                        <th>Auditorium</th>
                        <th>Red Room</th>
                        <th>Blue Room</th>
                        <th>Foto Studio</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMonthBookings.length === 0 ? (
                        <tr>
                            <td colSpan="7">Ingen bookinger denne måneden.</td>
                        </tr>
                    ) : (
                        currentMonthBookings.map((booking, idx) => (
                            <tr key={idx}>
                                <td>{formatDate(booking.date)}</td>
                                <td>{booking.green > 0 ? `${booking.green}t` : ""}</td>
                                <td>{booking.yellow > 0 ? `${booking.yellow}t` : ""}</td>
                                <td>{booking.auditorium > 0 ? `${booking.auditorium}t` : ""}</td>
                                <td>{booking.red > 0 ? `${booking.red}t` : ""}</td>
                                <td>{booking.blue > 0 ? `${booking.blue}t` : ""}</td>
                                <td>{booking.foto > 0 ? `${booking.foto}t` : ""}</td>
                            </tr>
                        ))
                    )}
                </tbody>
                {currentMonthBookings.length > 0 && (
                    <tfoot>
                        <tr>
                            <td style={{ fontWeight: "bold", color: "#6f42c1" }}>Totalt:</td>
                            <td>{getFormattedTotal('greenroom@catchmedia.no')}</td>
                            <td>{getFormattedTotal('yellow')}</td>
                            <td>{getFormattedTotal('auditorium')}</td>
                            <td>{getFormattedTotal('red')}</td>
                            <td>{getFormattedTotal('blue')}</td>
                            <td>{getFormattedTotal('foto')}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default UserCalendar;