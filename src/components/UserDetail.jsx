// TabContent som kommer opp når man velger "Leietakere"

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faSave,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import UserCalendar from "./UserCalendar"; // ← import your new component

const UserDetail = ({ user, onSave, onClose, onDelete }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [pin, setPin] = useState(user.pin || "");
    const [monthOffset, setMonthOffset] = useState(0);
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

    const generateBookings = () => {
        const baseDate = new Date();
        baseDate.setDate(1);
        baseDate.setMonth(baseDate.getMonth() + monthOffset);

        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const bookingsArray = [];

        for (let day = 1; day <= lastDay; day++) {
            if (Math.random() < 0.3) {
                const date = new Date(year, month, day);
                bookingsArray.push({
                    date,
                    green: Math.floor(Math.random() * 3),
                    yellow: Math.floor(Math.random() * 3),
                    auditorium: Math.floor(Math.random() * 3),
                });
            }
        }

        return bookingsArray;
    };

    useEffect(() => {
        setBookings(generateBookings());
    }, [monthOffset]);

    const inputStyle = {
        maxWidth: "300px",
        color: "#6f42c1",
        backgroundColor: "#ffffff",
        border: "1px solid #ccc",
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

            {/* Inputs */}
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
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Lagre
                </button>
            </div>

            <hr />

            {/* Calendar Section */}
            <UserCalendar bookings={user.bookings || []} />
        </div>
    );
};

export default UserDetail;
