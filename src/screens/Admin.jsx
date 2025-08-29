import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuthContext } from "../provider/AuthProvider";
import { useConfigProvider } from "../provider/ConfigProvider";
import { FullscreenLoader } from "./FullscreenLoader";

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
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("leietakere");
    const [savingUserDetails, setSavingUserDetails] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);
    const [hasAccess, setHasAccess] = useState(null);
    const accessToken = localStorage.getItem('hatchbooking_admin_token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!accessToken) {
                setHasAccess(false);
                return;
            }

            try {
                const res = await apiCall({
                    action: 'validateAdminToken',
                    adminToken: accessToken
                });
                setHasAccess(res.success);
            } catch (err) {
                setHasAccess(false);
            }
        };

        verifyToken();
    }, [accessToken, apiCall]);


    if (hasAccess === null) return <FullscreenLoader theme="light" />; // loading
    if (!hasAccess) return <Login setUser={setUser} />;

    return (
        <AdminContext.Provider value={{
            user,
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
            },
            updateUserInfo: (data) => {
                setUser(data)
            },
            logout: async () => {
                await apiCall({
                    action: 'adminLogout',
                    adminToken: accessToken
                })
                    .then((res) => {
                        if (res.success) {
                            localStorage.removeItem('hatchbooking_admin_token');
                            setUser([]);
                        }
                    })
            }
        }}>
            {children}
        </AdminContext.Provider>
    )
}

const Login = ({ setUser }) => {
    const { apiCall } = useAuthContext();
    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "God morgen!";
        if (hour < 18) return "God ettermiddag!";
        return "God kveld!";
    };

    // Login into modx
    const login = async () => {
        setLoading(true);
        setError(undefined);

        await apiCall({
            action: 'adminLogin',
            username: email,
            password
        })
            .then((res) => {
                if (!res.success) {
                    setError(res.message);
                }

                // Save userinfo
                setUser(res.data);

                // Save accesstoken in localstorage
                localStorage.setItem('hatchbooking_admin_token', res.data.token)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <section id="admin-login">
            <div className="d-flex h-100">
                <div className="login-item-left d-flex justify-content-center">
                    <div className="admin-login-box rounded-4 p-3 h-100 d-flex flex-column justify-content-center mx-2 mx-xl-5">
                        <h2 className="text-body">{getGreeting()}</h2>
                        <p>Logg inn med MODX brukeren din for å få tilgang til Admin</p>

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="d-flex flex-column gap-3 mt-4">
                            <Input
                                value={email}
                                onChange={setEmail}
                                placeholder="Brukernavn"
                                classes="white-input"
                                type="email"
                            />
                            <Input
                                value={password}
                                onChange={setPassword}
                                placeholder="Passord"
                                classes="white-input"
                                type="password"
                            />

                            <Button
                                text="Login"
                                type="primary"
                                onClick={login}
                                disabled={!email || !password}
                                loading={loading}
                                rightIcon="arrow-right"
                            />
                        </div>
                    </div>
                </div>
                <div className="login-item-right">
                    <img src="https://www.catchmedia.no/files/images/HATCH/hatch-leieplasser-5830.jpg" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
            </div>
        </section>
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
    const { selectedTab, handleTabClick, logout } = useAdminContext();

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="d-flex flex-column gap-4 h-100">
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

                    <Button
                        text="Logg ut"
                        rightIcon="left-from-bracket"
                        classes="py-4 d-flex justify-content-between align-items-center mt-auto"
                        type="white"
                        onClick={logout}
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
    const [searchValue, setSearchValue] = useState('');

    // Filter users based on searchValue
    const filteredUsers = users
        .filter(user =>
            user.displayName.toLowerCase().includes(searchValue.toLowerCase()) || user.mail.toLowerCase().includes(searchValue.toLowerCase())
        )
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return (
        <>
            <div className="row align-items-center">
                <div className="col">
                    <Input
                        placeholder="Søk..."
                        classes="white-input w-100"
                        value={searchValue}
                        onChange={setSearchValue}
                    />
                </div>
                <div className="col-auto text-end">
                    <Button
                        text="Legg til"
                        leftIcon="plus"
                        onClick={handleAddUser}
                    />
                </div>
            </div>

            <div
                className="row mt-2 gy-4 overflow-auto"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
            >
                {filteredUsers.map((user, index) => (
                    <UserItem key={index} user={user} />
                ))}
            </div>
        </>
    );
}

const UserItem = ({ user }) => {
    const { handleUserClick } = useAdminContext();

    return (
        <div className="col-12 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={["far", user.hidden ? "eye-slash" : "eye"]} className="me-2 text-muted" />
                <a href="#" className="h4 text-body mb-0 text-decoration-underline cursor-pointer" onClick={() => handleUserClick(user)}>{user.displayName}</a>
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
        return !name || !email;
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
            <div className="row align-items-center">
                <div className="col-auto">
                    {user.azure ? "Azure bruker" : "Egendefinert bruker"}
                </div>
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
                        onChange={e => setHidden(e.target.value)}
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

    const [bookings, setBookings] = useState({});
    const [rooms, setRooms] = useState({});
    const [monthOffset, setMonthOffset] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCurrentMonthTitle = () => {
        const refDate = new Date();
        refDate.setMonth(refDate.getMonth() + monthOffset);
        return `${norwegianMonths[refDate.getMonth()]} ${refDate.getFullYear()}`;
    };

    const getBookings = async () => {
        setLoading(true);
        try {
            const refDate = new Date();
            refDate.setMonth(refDate.getMonth() + monthOffset);

            const res = await apiCall({
                action: 'getMonthlyUserRoomStats',
                month: refDate.getFullYear() + '-' + String(refDate.getMonth() + 1).padStart(2, '0')
            });

            if (res.status === 200) {
                setBookings(res.data);
                setRooms(res.rooms);
            } else {
                setBookings([]);
                setRooms([]);
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
    }, [monthOffset]);

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
                                {rooms?.sort((a, b) => a.localeCompare(b))?.map((room, index) => (
                                    <th key={index} scope="col" className="text-primary unbreakable">{room}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings
                                .filter(item => item.total > 0)
                                .map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row" className="text-primary unbreakable pe-4" style={{ borderRight: '1px solid var(--bs-primary)' }}>
                                            {item.user}
                                        </th>
                                        {rooms.map((roomKey, colIndex) => {
                                            const hours = item[roomKey];
                                            if (!hours) return <td key={colIndex}></td>;

                                            const wholeHours = Math.floor(hours);
                                            const minutes = Math.round((hours - wholeHours) * 60);
                                            return (
                                                <td key={colIndex} className="text-end">
                                                    {wholeHours}:{minutes.toString().padStart(2, '0')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}



                            {/*  {filteredDates.map((date, rowIndex) => (
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
                            ))} */}
                            {/* <tr>
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
                            </tr> */}
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