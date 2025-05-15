import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthContext } from "../provider/AuthProvider";
import { useConfigProvider } from "../provider/ConfigProvider";

const AdminContext = createContext();
const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within a AdminProvider");
    }
    return context;
}

const AdminProvider = ({ children }) => {
    const { apiCall } = useAuthContext();
    const { users, updateUsers, rooms } = useConfigProvider();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("bookinger");
    const [savingUserDetails, setSavingUserDetails] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);

    return (
        <AdminContext.Provider value={{
            users,
            rooms,
            selectedUser,
            selectedTab,
            savingUserDetails,
            deletingUser,
            setSelectedUser,
            setSelectedTab,
            handleTabClick: (tab) => setSelectedTab(tab),
            handleUserClick: (user) => {
                setSelectedUser(user);
                setSelectedTab("userDetails");
            },
            handleAddUser: () => {
                setSelectedUser({ displayName: "", mail: "", pin: "", hidden: false });
                setSelectedTab("userDetails");
            },
            handleSaveUser: async (updatedUser) => {
                setSavingUserDetails(true);
                await apiCall({
                    action: 'updateUser',
                    data: updatedUser
                })
                    .then((res) => {
                        if (res.status === 200) {
                            const userExists = users.some((user) => user.mail === updatedUser.mail);
                            if (!userExists) {
                                updateUsers((prevUsers) => [...prevUsers, updatedUser]);
                                toast.success("Bruker lagt til!")
                            } else {
                                const updatedUsers = users.map((user) =>
                                    user.mail === updatedUser.mail ? updatedUser : user
                                );
                                updateUsers(updatedUsers);
                                toast.success("Bruker oppdatert!")
                            }
                        }
                    })
                    .finally(() => {
                        setSelectedUser(null);
                        setSelectedTab('leietakere');
                        setSavingUserDetails(false);
                    });
            },
            handleDeleteUser: async (userToDelete) => {
                setDeletingUser(true);
                await apiCall({
                    action: 'deleteUser',
                    email: userToDelete.mail
                })
                    .then((res) => {
                        if (res.status === 200) {
                            toast.success("Bruker slettet!");

                            const filteredUsers = users.filter((u) => u.mail !== userToDelete.mail);
                            updateUsers(filteredUsers);
                        } else {
                            toast.error("Kunne ikke slette bruker");
                        }
                    })
                    .finally(() => {
                        setSelectedUser(null);
                        setSelectedTab("leietakere");
                        setDeletingUser(false);
                    })
            }
        }}>
            {children}
        </AdminContext.Provider>
    )
}

const Admin = () => (
    <AdminProvider>
        <section className="admin-section">
            <div className="container">
                <div className="row">
                    <div className="col-12 py-4">
                        <h2 className="text-body">Booking Admin</h2>
                    </div>
                </div>

                <Content />
            </div>
        </section>
    </AdminProvider>
)

const Content = () => {
    const { selectedTab, handleTabClick, selectedUser } = useAdminContext();

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="d-flex flex-column gap-4">
                    <Button
                        text="Leietakere"
                        rightIcon="chevron-right"
                        classes="py-4 d-flex justify-content-between align-items-center"
                        type={selectedTab === "leietakere" || selectedTab === "userDetails" ? "primary" : "white"}
                        onClick={() => handleTabClick("leietakere")}
                    />
                    <Button
                        text="Bookinger"
                        rightIcon="chevron-right"
                        classes="py-4 d-flex justify-content-between align-items-center"
                        type={selectedTab === "bookinger" ? "primary" : "white"}
                        onClick={() => handleTabClick("bookinger")}
                    />
                </div>
            </div>

            <div className="col-lg-8">
                {selectedTab === "leietakere" && (
                    <div className="bg-white p-4 rounded-4 position-relative" style={{ height: 'calc(100vh - 150px)' }}>
                        {selectedTab === "leietakere" && <Users />}
                    </div>
                )}

                {selectedTab === "bookinger" && (
                    <div className="bg-white p-4 rounded-4 position-relative" style={{ height: 'calc(100vh - 150px)' }}>
                        {selectedTab === "bookinger" && <Bookings />}
                    </div>
                )}

                {selectedTab === "userDetails" && (
                    <>
                        <div className="bg-white p-4 rounded-4 position-relative">
                            <UserDetail />
                        </div>
                        <div className="bg-white p-4 rounded-4 position-relative mt-4 mb-5">
                            <UserCalendar />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const Users = () => {
    const { users, handleAddUser } = useAdminContext();

    return (
        <>
            <div className="row align-items-center">
                <div className="col text-end">
                    <Button
                        text="Legg til"
                        leftIcon="plus"
                        onClick={handleAddUser}
                    />
                </div>
            </div>

            <div className="row mt-2 gy-4 overflow-scroll" style={{ height: 'calc(100vh - 250px)' }}>
                {users.sort((a, b) => a.displayName.localeCompare(b.displayName)).map((user, index) => (
                    <UserItem key={index} user={user} />
                ))}
            </div>
        </>
    )
}

const UserItem = ({ user }) => {
    const { handleUserClick } = useAdminContext();

    return (
        <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={["far", user.hidden ? "eye-slash" : "eye"]} className="me-2 text-muted" />
                <h4 className="text-body mb-0 text-decoration-underline cursor-pointer" onClick={() => handleUserClick(user)}>{user.displayName}</h4>
            </div>
            <span className="text-muted">{user.mail}</span>
        </div>
    )
}

const UserDetail = () => {
    const { selectedUser: user, handleTabClick, handleSaveUser, users, savingUserDetails, deletingUser, handleDeleteUser } = useAdminContext();

    const [name, setName] = useState(user.displayName);
    const [email, setEmail] = useState(user.mail);
    const [pin, setPin] = useState(user.pin || "");
    const [hidden, setHidden] = useState(user.hidden);

    const [emailError, setEmailError] = useState("");

    const hasChanges = () => {
        return name !== user.displayName || email !== user.mail || pin !== (user.pin ?? "") || hidden !== user.hidden;
    }

    const missingFields = () => {
        return !name || !email || !pin;
    }

    const handleEmailChange = (value) => {
        setEmail(value);

        // Clear previous error
        setEmailError("");

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value) {
            setEmailError("Ugyldig e-postadresse");
            return;
        }

        // Check for duplicate email
        const isDuplicate = users.some(u => u.mail === value && u.mail !== user.mail);
        if (isDuplicate) {
            setEmailError("E-postadressen er allerede i bruk");
        }
    }

    return (
        <>
            <div className="row">
                <div className="col text-end">
                    <Button
                        text="Lukk"
                        leftIcon="times"
                        onClick={() => handleTabClick("leietakere")}
                    />
                </div>
            </div>

            <div className="row gy-3 mt-3">
                <div className="col-lg-4 text-end fw-semibold pt-2">Navn</div>
                <div className="col-lg-8">
                    <Input
                        value={name}
                        onChange={setName}
                        placeholder="Navn"
                        classes="white-input"
                        disabled={user.azure}
                    />
                </div>

                <div className="col-lg-4 text-end fw-semibold pt-2">e-postaddresse</div>
                <div className="col-lg-8">
                    <Input
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="e-postaddresse"
                        classes="white-input"
                        disabled={user.azure}
                        type="email"
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}
                </div>

                <div className="col-lg-4 text-end fw-semibold pt-2">PIN</div>
                <div className="col-lg-8">
                    <Input
                        value={pin}
                        onChange={setPin}
                        placeholder="PIN"
                        classes="white-input"
                    />
                </div>

                <div className="col-lg-4 text-end fw-semibold pt-2">Skjul fra oversikt</div>
                <div className="col-lg-8">
                    <select
                        className="form-select white-input"
                        value={hidden}
                        onChange={setHidden}
                    >
                        <option value="0">Nei</option>
                        <option value="1">Ja</option>
                    </select>
                </div>
            </div>

            <div className="row mt-3 justify-content-end">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between">
                        <Button
                            text="Slett"
                            leftIcon="trash"
                            type="grey"
                            classes="text-danger"
                            onClick={() => handleDeleteUser(user)}
                            disabled={deletingUser || user.azure}
                        />
                        <Button
                            text="Lagre"
                            leftIcon="floppy-disk"
                            type="success"
                            classes="text-white"
                            onClick={() => handleSaveUser({ ...user, displayName: name, mail: email, pin: pin, hidden: hidden })}
                            disabled={!hasChanges() || missingFields() || emailError || savingUserDetails}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

const UserCalendar = () => {
    const { apiCall } = useAuthContext();
    const { rooms, selectedUser: user } = useAdminContext();

    const [bookings, setBookings] = useState({});
    const [allDates, setAllDates] = useState([]);
    const [monthOffset, setMonthOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCurrentMonthTitle = () => {
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() + monthOffset);
        return `${norwegianMonths[refDate.getMonth()]} ${refDate.getFullYear()}`;
    };

    const getBookings = async () => {
        try {
            const res = await apiCall({
                action: 'getUserBookings',
                email: user.mail
            });

            if (res.status === 200) {
                const allDates = Array.from(
                    new Set(
                        Object.values(res.data)
                            .flatMap(room => Object.keys(room.days))
                    )
                ).sort();

                setBookings(res.data);
                setAllDates(allDates);
            } else {
                setBookings([]);
                toast.error("Kunne ikke hente bookinger");
            }
        } catch (error) {
            toast.error("En feil oppstod under henting av bookinger");
            setBookings({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    const filteredDates = useMemo(() => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + monthOffset);
        const targetMonth = currentDate.getMonth();
        const targetYear = currentDate.getFullYear();

        return allDates.filter(date => {
            const bookingDate = new Date(date);
            return bookingDate.getMonth() === targetMonth &&
                bookingDate.getFullYear() === targetYear;
        });
    }, [allDates, monthOffset]);

    return (
        <>
            <div className="row">
                <div className="col text-end">
                    <FontAwesomeIcon
                        icon={["fas", "chevron-left"]}
                        className="text-primary"
                        onClick={() => setMonthOffset((prev) => prev - 1)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <div className="col-4 text-center">
                    <h4 className="mb-0 px-3 text-primary fw-semibold">{getCurrentMonthTitle()}</h4>
                </div>
                <div className="col text-start">
                    <FontAwesomeIcon
                        icon={["fas", "chevron-right"]}
                        className="text-primary"
                        onClick={() => setMonthOffset((prev) => prev + 1)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>

            <div className="row mt-3 overflow-x-scroll">
                {loading ? (
                    <div className="d-flex flex-column gap-2 placeholder-glow mt-2">
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                    </div>
                ) : (
                    <table className="table primary-borders">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                {rooms?.sort((a, b) => a.name.localeCompare(b.name))?.map((room, index) => (
                                    <th key={index} scope="col" className="text-primary unbreakable">{room.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDates.map((date, rowIndex) => (
                                <tr key={rowIndex}>
                                    <th scope="row" className="text-primary unbreakable pe-4" style={{ borderRight: '1px solid var(--bs-primary)' }}>{format(date, 'dd.MM.yyyy')}</th>
                                    {rooms.map((room, colIndex) => {
                                        const hours = bookings[room.email]?.days?.[date] ?? 0;
                                        const wholeHours = Math.floor(hours);
                                        const minutes = Math.round((hours - wholeHours) * 60);
                                        return hours ?
                                            <td key={colIndex} className="text-end">
                                                {wholeHours}:{minutes.toString().padStart(2, '0')}
                                            </td>
                                            : <td></td>;
                                    })}
                                </tr>
                            ))}
                            <tr>
                                <th scope="row text-primary unbreakable pe-4" style={{ borderBottom: 'none' }}></th>
                                {rooms.map((room, index) => {
                                    const monthlyHours = filteredDates.reduce((total, date) => {
                                        return total + (bookings[room.email]?.days?.[date] ?? 0);
                                    }, 0);
                                    const wholeHours = Math.floor(monthlyHours);
                                    const minutes = Math.round((monthlyHours - wholeHours) * 60);
                                    return (
                                        <td key={index} className="text-end" style={{ borderBottom: 'none' }}>
                                            {wholeHours > 0 || minutes > 0 ? <strong>{wholeHours}:{minutes.toString().padStart(2, '0')}</strong> : ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                )}

            </div>
        </>
    )
}

const Bookings = () => {
    const { apiCall } = useAuthContext();
    const { rooms, selectedUser: user } = useAdminContext();

    const [bookings, setBookings] = useState({});
    const [allDates, setAllDates] = useState([]);
    const [monthOffset, setMonthOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCurrentMonthTitle = () => {
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() + monthOffset);
        return `${norwegianMonths[refDate.getMonth()]} ${refDate.getFullYear()}`;
    };

    const getBookings = async () => {
        try {
            const res = await apiCall({
                action: 'getUserBookings',
                email: user.mail
            });

            if (res.status === 200) {
                const allDates = Array.from(
                    new Set(
                        Object.values(res.data)
                            .flatMap(room => Object.keys(room.days))
                    )
                ).sort();

                setBookings(res.data);
                setAllDates(allDates);
            } else {
                setBookings([]);
                toast.error("Kunne ikke hente bookinger");
            }
        } catch (error) {
            toast.error("En feil oppstod under henting av bookinger");
            setBookings({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    const filteredDates = useMemo(() => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + monthOffset);
        const targetMonth = currentDate.getMonth();
        const targetYear = currentDate.getFullYear();

        return allDates.filter(date => {
            const bookingDate = new Date(date);
            return bookingDate.getMonth() === targetMonth &&
                bookingDate.getFullYear() === targetYear;
        });
    }, [allDates, monthOffset]);

    return (
        <>
            <div className="row">
                <div className="col text-end">
                    <FontAwesomeIcon
                        icon={["fas", "chevron-left"]}
                        className="text-primary"
                        onClick={() => setMonthOffset((prev) => prev - 1)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <div className="col-4 text-center">
                    <h4 className="mb-0 px-3 text-primary fw-semibold">{getCurrentMonthTitle()}</h4>
                </div>
                <div className="col text-start">
                    <FontAwesomeIcon
                        icon={["fas", "chevron-right"]}
                        className="text-primary"
                        onClick={() => setMonthOffset((prev) => prev + 1)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </div>

            <div className="row mt-3 overflow-x-scroll">
                {loading ? (
                    <div className="d-flex flex-column gap-2 placeholder-glow mt-2">
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-12"></span>
                    </div>
                ) : (
                    <table className="table primary-borders">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                {rooms?.sort((a, b) => a.name.localeCompare(b.name))?.map((room, index) => (
                                    <th key={index} scope="col" className="text-primary unbreakable">{room.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDates.map((date, rowIndex) => (
                                <tr key={rowIndex}>
                                    <th scope="row" className="text-primary unbreakable pe-4" style={{ borderRight: '1px solid var(--bs-primary)' }}>{format(date, 'dd.MM.yyyy')}</th>
                                    {rooms.map((room, colIndex) => {
                                        const hours = bookings[room.email]?.days?.[date] ?? 0;
                                        const wholeHours = Math.floor(hours);
                                        const minutes = Math.round((hours - wholeHours) * 60);
                                        return hours ?
                                            <td key={colIndex} className="text-end">
                                                {wholeHours}:{minutes.toString().padStart(2, '0')}
                                            </td>
                                            : <td></td>;
                                    })}
                                </tr>
                            ))}
                            <tr>
                                <th scope="row text-primary unbreakable pe-4" style={{ borderBottom: 'none' }}></th>
                                {rooms.map((room, index) => {
                                    const totalHours = bookings[room.email]?.total_hours ?? 0;
                                    const wholeHours = Math.floor(totalHours);
                                    const minutes = Math.round((totalHours - wholeHours) * 60);
                                    return (
                                        <td key={index} className="text-end" style={{ borderBottom: 'none' }}>
                                            {wholeHours > 0 && minutes > 0 ? <strong>{wholeHours}:{minutes.toString().padStart(2, '0')}</strong> : ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

const norwegianMonths = [
    "Januar", "Februar", "Mars", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Desember"
];

export default Admin;