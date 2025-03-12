import React, { useState } from "react";
import Button from "../components/Button"; // Import the Button component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";

const Tabs = () => {
    // Track selected tab: 'leietakere' or 'bookinger'
    const [selectedTab, setSelectedTab] = useState("leietakere");

    const users = [
        { name: "Ola Nordmann", email: "ola.nordmann@example.com" },
        { name: "Kari Nordmann", email: "kari.nordmann@example.com" },
        { name: "Per Hansen", email: "per.hansen@example.com" },
        { name: "Lise Johansen", email: "lise.johansen@example.com" }
    ];

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleUserClick = (userName) => {
        alert(`You clicked on ${userName}`);
    };

    // Sidebar Component (Left Tab Buttons)
    const Sidebar = () => {
        return (
            <div className="col-3 d-flex flex-column p-3" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Button
                    text="Leietakere"
                    type={selectedTab === "leietakere" ? "purple" : "outline-dark"}
                    onClick={() => handleTabClick("leietakere")}
                />
                <Button
                    text="Bookinger"
                    type={selectedTab === "bookinger" ? "purple" : "outline-dark"}
                    onClick={() => handleTabClick("bookinger")}
                />
            </div>
        );
    };

    // Add Button Component
    const AddButton = () => {
        return (
            <div className="d-flex justify-content-end mb-3">
                <Button
                    text="Legg til"
                    type="primary"
                    onClick={() => alert("Add Button Clicked")}
                />
            </div>
        );
    };

    // User List Component (for Leietakere)
    const UserList = () => {
        return (
            <div className="list-group">
                {users.map((user, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center mb-3 py-3" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <h4
                            className="m-0 text-primary"
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => handleUserClick(user.name)}
                        >
                            {user.name}
                        </h4>
                        <span className="text-muted fs-6" style={{ opacity: 0.6 }}>
                            <small>{user.email}</small>
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    // Tab Content Component
    const TabContent = () => {
        return (
            <div className="col-9 p-5" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                {/* Conditionally render the AddButton for Leietakere only */}
                {selectedTab === "leietakere" && <AddButton />}

                {selectedTab === "leietakere" && <UserList />}
                {selectedTab === "bookinger" && (
                    <div>
                        <h4 style={{ color: "#000000" }}>Hello World from Bookinger!</h4>
                        <p>This section will display booking details when "Bookinger" is selected.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="container-fluid" style={{ minHeight: "100vh", padding: "20px" }}>
            <div className="row">
                <Sidebar />
                <TabContent />
            </div>
        </div>
    );
};

export default Tabs;
