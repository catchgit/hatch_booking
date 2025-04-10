import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faSave,
    faTimes,
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";

const UserDetail = ({ user, onSave, onClose, onDelete }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [pin, setPin] = useState(user.pin || "");
    const [startDayOffset, setStartDayOffset] = useState(0);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        setPin(user.pin || "");
    }, [user]);

    const handleSave = () => {
        const updatedUser = { ...user, name, email, pin };
        onSave(updatedUser);
    };

    const handleDelete = () => {
        onDelete(user);
    };

    const norwegianMonths = [
        "januar", "februar", "mars", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "desember"
    ];

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const monthName = norwegianMonths[d.getMonth()];
        const year = d.getFullYear();
        return `${day}. ${monthName} ${year}`;
    };

    const getCurrentMonthTitle = () => {
        const firstDate = new Date();
        firstDate.setDate(firstDate.getDate() + startDayOffset);
        return `${norwegianMonths[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
    };

    const generateBookings = (offsetStart) => {
        const today = new Date();
        const bookingsArray = [];

        for (let i = 0; i < 4; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + offsetStart + i);

            bookingsArray.push({
                date: date,
                green: Math.floor(Math.random() * 3),
                yellow: Math.floor(Math.random() * 3),
                auditorium: Math.floor(Math.random() * 3),
            });
        }

        return bookingsArray;
    };

    useEffect(() => {
        setBookings(generateBookings(startDayOffset));
    }, [startDayOffset]);

    const inputStyle = {
        maxWidth: "300px",
        color: "#6f42c1", // purple text
        backgroundColor: "#ffffff", // white background
        border: "1px solid #ccc", // gray border
        borderRadius: "4px",
        padding: "8px"
    };

    return (
        <div>
            {/* Close Button */}
            <div className="d-flex justify-content-end mb-3">
                <button onClick={onClose} className="btn btn-link" style={{ color: "#6f42c1" }}>
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Lukk
                </button>
            </div>

            <h4>Rediger Bruker</h4>

            {/* Navn */}
            <div className="d-flex mb-3">
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>Navn</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    style={inputStyle}
                />
            </div>

            {/* E-postadresse */}
            <div className="d-flex mb-3">
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>E-postadresse</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    style={inputStyle}
                />
            </div>

            {/* PIN */}
            <div className="d-flex mb-3">
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>PIN</span>
                <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="form-control"
                    style={inputStyle}
                />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mb-4">
                <button onClick={handleDelete} className="btn btn-danger">
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Slett
                </button>
                <button onClick={handleSave} className="btn" style={{ backgroundColor: "#28a745", color: "#fff" }}>
                    <FontAwesomeIcon icon={faSave} className="me-2" style={{ color: "#fff" }} />
                    Lagre
                </button>
            </div>

            <hr />

            {/* Calendar Header */}
            <div className="d-flex align-items-center justify-content-between mb-2" style={{ maxWidth: "100%" }}>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setStartDayOffset((prev) => prev - 4)}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h6 className="m-0 text-center" style={{ flexGrow: 1 }}>
                    {getCurrentMonthTitle()}
                </h6>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setStartDayOffset((prev) => prev + 4)}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>

            {/* Calendar Table (no scroll) */}
            <div className="table-responsive" style={{ overflowX: "hidden" }}>
                <table className="table table-sm table-bordered text-center align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "200px" }}>Dato</th>
                            <th>Green Room</th>
                            <th>Yellow Room</th>
                            <th>Auditorium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: "bold" }}>{formatDate(booking.date)}</td>
                                <td>{booking.green > 0 ? `${booking.green}t` : "-"}</td>
                                <td>{booking.yellow > 0 ? `${booking.yellow}t` : "-"}</td>
                                <td>{booking.auditorium > 0 ? `${booking.auditorium}t` : "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDetail;
