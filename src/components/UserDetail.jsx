import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const UserDetail = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [pin, setPin] = useState(user.pin || ""); // Set the PIN to the user's current PIN (or an empty string if not set)

    const handleSave = () => {
        const updatedUser = { ...user, name, email, pin };
        onSave(updatedUser); // Call the parent component's save handler
    };

    const handleDelete = () => {
        alert("Delete user: " + user.name); // Implement delete logic as needed
    };

    return (
        <div>
            {/* Close Button */}
            <div className="d-flex justify-content-end mb-3">
                <button
                    onClick={onClose}
                    className="btn btn-link d-flex align-items-center"
                    style={{
                        color: "#6f42c1", // Purple color (same as button)
                        fontSize: "1rem",
                        textDecoration: "none"
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Lukk
                </button>
            </div>

            <h4>Edit User Details</h4>

            {/* Navn */}
            <div className="d-flex mb-3" style={{ padding: "10px 0", borderBottom: "1px solid #ccc" }}>
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>Navn</span>
                <div
                    style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                        width: "300px",
                        color: "#6f42c1", // Purple color (same as button)
                    }}
                >
                    {name}
                </div>
            </div>

            {/* E-postadresse */}
            <div className="d-flex mb-3" style={{ padding: "10px 0", borderBottom: "1px solid #ccc" }}>
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>E-postadresse</span>
                <div
                    style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                        width: "300px",
                        color: "#6f42c1", // Purple color (same as button)
                    }}
                >
                    {email}
                </div>
            </div>

            {/* PIN */}
            <div className="d-flex mb-3" style={{ padding: "10px 0", borderBottom: "1px solid #ccc" }}>
                <span style={{ width: "200px", fontWeight: "bold", color: "#6f42c1" }}>PIN</span>
                <div
                    style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                        width: "300px",
                        color: "#6f42c1", // Purple color (same as button)
                    }}
                >
                    {pin || "Not Set"}
                </div>
            </div>

            {/* Buttons: Delete & Save */}
            <div className="d-flex justify-content-between align-items-center mb-3" style={{ padding: "10px 0" }}>
                <button
                    onClick={handleDelete}
                    className="btn btn-danger d-flex align-items-center"
                    style={{ padding: "10px 20px", fontSize: "1rem", marginRight: "10px" }}
                >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Slett
                </button>
                <button
                    onClick={handleSave}
                    className="btn btn-primary d-flex align-items-center"
                    style={{ padding: "10px 20px", fontSize: "1rem" }}
                >
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Lagre
                </button>
            </div>
        </div>
    );
};

export default UserDetail;
