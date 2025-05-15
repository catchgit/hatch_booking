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
    const [name, setName] = useState(user.displayName);
    const [email, setEmail] = useState(user.mail);
    const [pin, setPin] = useState(user.pin || "");
    const [hidden, setHidden] = useState(user.hidden);
    const [monthOffset, setMonthOffset] = useState(0);
    const [bookings, setBookings] = useState([]);

    const handleSave = () => {
        const updatedUser = { ...user, displayName: name, mail: email, pin, hidden: hidden ?? false };
        onSave(updatedUser);
    };

    const handleDelete = () => {
        onDelete(user);
    };

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
                    disabled={user.azure}
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
                    disabled={user.azure}
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
            <div className="d-flex mb-3">
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>Gjemt</span>
                <select
                    className="form-select"
                    style={inputStyle}
                    value={hidden}
                    onChange={(e) => setHidden(e.target.value)}
                >
                    <option value="0">Nei</option>
                    <option value="1">Ja</option>
                </select>
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
            <UserCalendar user={user.mail} />
        </div>
    );
};

export default UserDetail;
