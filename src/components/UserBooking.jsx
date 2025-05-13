import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const norwegianMonths = [
    "januar", "februar", "mars", "april", "mai", "juni",
    "juli", "august", "september", "oktober", "november", "desember"
];

const UserBooking = ({ users }) => {
    const [monthOffset, setMonthOffset] = useState(0);

    // Function to check if a user has bookings in the current month
    const hasBookingsThisMonth = (user) => {
        const currentMonth = new Date();
        const targetMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
        return user.bookings.some(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getMonth() === targetMonth.getMonth() &&
                bookingDate.getFullYear() === targetMonth.getFullYear();
        });
    };

    // Filter users to show only those with bookings in the current month
    const filteredUsers = useMemo(() => users.filter(hasBookingsThisMonth), [users, monthOffset]);

    // Function to calculate the total booked hours for a room for each user
    const getTotalForRoom = (user, room) => {
        return user.bookings
            ? user.bookings.reduce((sum, booking) => sum + (booking[room] || 0), 0)
            : 0;
    };

    // Room names array for easy mapping to columns
    const rooms = ["green", "yellow", "auditorium", "red", "blue", "foto"];

    // Format the current month
    const getCurrentMonthTitle = () => {
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() + monthOffset);
        return `${norwegianMonths[refDate.getMonth()]} ${refDate.getFullYear()}`;
    };

    return (
        <div>
            {/* Navigation for months */}
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

            {/* Booking table */}
            <table className="table table-sm table-bordered text-center align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th>User</th>
                        {rooms.map((room) => (
                            <th key={room}>{room.charAt(0).toUpperCase() + room.slice(1)} Room</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={rooms.length + 1}>No users with bookings this month.</td>
                        </tr>
                    ) : (
                        filteredUsers.map((user, idx) => (
                            <tr key={idx}>
                                <td>{user.name}</td>
                                {rooms.map((room, roomIdx) => (
                                    <td key={roomIdx}>
                                        {getTotalForRoom(user, room) > 0
                                            ? `${getTotalForRoom(user, room)}t`
                                            : ""}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserBooking;
