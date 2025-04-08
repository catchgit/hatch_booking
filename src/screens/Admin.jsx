import React, { useState } from "react";
import Button from "../components/Button"; // Import the Button component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import UserDetail from "../components/UserDetail"; // Import the new UserDetail component

const Tabs = () => {
    const [selectedTab, setSelectedTab] = useState("leietakere");
    const [selectedUser, setSelectedUser] = useState(null); // Track the selected user

    const users = [
        { name: "Ola Nordmann", email: "ola.nordmann@example.com" },
        { name: "Kari Nordmann", email: "kari.nordmann@example.com" },
        { name: "Per Hansen", email: "per.hansen@example.com" },
        { name: "Lise Johansen", email: "lise.johansen@example.com" }
    ];

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setSelectedTab("userDetails"); // Switch to the user details tab
    };

    const handleSaveUser = (updatedUser) => {
        // Update the users array or handle save logic here
        console.log("Updated user:", updatedUser);
        setSelectedUser(updatedUser);
        setSelectedTab("leietakere"); // Optionally switch back to the "leietakere" tab after saving
    };

    const Sidebar = () => {
        return (
            <div className="col-3 d-flex flex-column p-2 gap-3" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Button
                    text={(
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <span className="text-start">Leietakere</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    )}
                    className="w-100 text-start"
                    style={{ padding: "20px", fontSize: "1.2rem" }}
                    onClick={() => handleTabClick("leietakere")}
                />
                <Button
                    text={(
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <span className="text-start">Bookinger</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    )}
                    className="w-100 text-start"
                    style={{ padding: "20px", fontSize: "1.2rem" }}
                    onClick={() => handleTabClick("bookinger")}
                />
            </div>
        );
    };

    const AddButton = () => {
        return (
            <div className="d-flex justify-content-end mb-3">
                <Button
                    text={(
                        <>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Legg til
                        </>
                    )}
                    type="primary"
                    onClick={() => alert("Add Button Clicked")}
                    style={{ padding: "10px 10px", fontSize: "1.2rem" }}
                />
            </div>
        );
    };

    const UserList = () => {
        return (
            <div className="list-group">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center mb-3 py-3"
                        style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                    >
                        <h4
                            className="m-0 text-primary"
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => handleUserClick(user)}
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

    const TabContent = () => {
        return (
            <div className="col-9 p-5" style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                {selectedTab === "leietakere" && <AddButton />}
                {selectedTab === "leietakere" && <UserList />}
                {selectedTab === "bookinger" && (
                    <div>
                        <h4 style={{ color: "#000000" }}>Hello World from Bookinger!</h4>
                        <p>This section will display booking details when "Bookinger" is selected.</p>
                    </div>
                )}
                {selectedTab === "userDetails" && selectedUser && (
                    <UserDetail user={selectedUser} onSave={handleSaveUser} />
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
