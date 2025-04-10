import React, { useState } from "react";
import Button from "../components/Button"; // Import the Button component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import UserDetail from "../components/UserDetail"; // Import the new UserDetail component

const Tabs = () => {
    const [selectedTab, setSelectedTab] = useState("leietakere");
    const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
    const [users, setUsers] = useState([
        { name: "Ola Nordmann", email: "ola.nordmann@example.com" },
        { name: "Kari Nordmann", email: "kari.nordmann@example.com" },
        { name: "Per Hansen", email: "per.hansen@example.com" },
        { name: "Lise Johansen", email: "lise.johansen@example.com" }
    ]);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setSelectedTab("userDetails"); // Switch to the user details tab
    };

    const handleSaveUser = (updatedUser) => {
        if (updatedUser.email && updatedUser.name) { // Ensure that both name and email are not empty
            if (updatedUser.email === "" || updatedUser.name === "") {
                alert("Both Name and Email are required.");
                return;
            }

            // Check if the user already exists
            const userExists = users.some((user) => user.email === updatedUser.email);

            if (!userExists) {
                // Add the new user to the list
                setUsers((prevUsers) => [...prevUsers, updatedUser]);
            } else {
                // Update the existing user
                const updatedUsers = users.map((user) =>
                    user.email === updatedUser.email ? updatedUser : user
                );
                setUsers(updatedUsers);
            }

            setSelectedUser(null); // Reset the selected user
            setSelectedTab("leietakere"); // Switch back to the "leietakere" tab
        }
    };


    const handleAddUser = () => {
        const emptyUser = { name: "", email: "", pin: "" };
        setSelectedUser(emptyUser); // Initialize with empty fields for a new user
        setSelectedTab("userDetails");
    };

    const handleDeleteUser = (userToDelete) => {
        const filteredUsers = users.filter((u) => u.email !== userToDelete.email);
        setUsers(filteredUsers);
        setSelectedUser(null);
        setSelectedTab("leietakere");
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
                    onClick={handleAddUser}
                    style={{ padding: "10px 10px", fontSize: "1.2rem" }}
                />
            </div>
        );
    };

    const UserList = ({ users, onUserClick }) => {
        return (
            <div className="list-group">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center mb-3 py-3"
                        style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}
                        onClick={() => onUserClick(user)} // Handle user click
                    >
                        <h4 className="m-0 text-primary" style={{ textDecoration: "underline", cursor: "pointer" }}>
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
                {selectedTab === "leietakere" && <UserList users={users} onUserClick={handleUserClick} />}
                {selectedTab === "bookinger" && (
                    <div>
                        <h4 style={{ color: "#000000" }}>Hello World from Bookinger!</h4>
                        <p>This section will display booking details when "Bookinger" is selected.</p>
                    </div>
                )}
                {selectedTab === "userDetails" && selectedUser && (
                    <UserDetail user={selectedUser} onSave={handleSaveUser} onClose={() => setSelectedTab("leietakere")} onDelete={handleDeleteUser} />
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
