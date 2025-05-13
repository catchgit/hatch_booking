import React, { useState } from "react";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import UserDetail from "../components/UserDetail";
import UserBooking from "../components/UserBooking"; // Import the new UserBookingCalendar
import { users as initialUsers } from "../components/data";

const Tabs = () => {
    const [selectedTab, setSelectedTab] = useState("leietakere");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(initialUsers);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setSelectedTab("userDetails"); // Switch to the user details tab
    };

    const handleSaveUser = (updatedUser) => {
        if (updatedUser.email && updatedUser.name) {
            const userExists = users.some((user) => user.email === updatedUser.email);

            if (!userExists) {
                setUsers((prevUsers) => [...prevUsers, updatedUser]);
            } else {
                const updatedUsers = users.map((user) =>
                    user.email === updatedUser.email ? updatedUser : user
                );
                setUsers(updatedUsers);
            }

            setSelectedUser(null);
            setSelectedTab("leietakere");
        }
    };

    const handleAddUser = () => {
        const emptyUser = { name: "", email: "", pin: "" };
        setSelectedUser(emptyUser);
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
                    text={<div className="d-flex justify-content-between align-items-center w-100"><span className="text-start">Leietakere</span><FontAwesomeIcon icon={faChevronRight} /></div>}
                    className="w-100 text-start"
                    style={{ padding: "20px", fontSize: "1.2rem" }}
                    onClick={() => handleTabClick("leietakere")}
                />
                <Button
                    text={<div className="d-flex justify-content-between align-items-center w-100"><span className="text-start">Bookinger</span><FontAwesomeIcon icon={faChevronRight} /></div>}
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
                        onClick={() => onUserClick(user)}
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
                    <UserBooking users={users} />  // Pass the 'users' state here
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
