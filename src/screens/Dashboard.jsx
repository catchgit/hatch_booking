import { useEffect, useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import { useAuthContext } from "../provider/AuthProvider";
import { useConfigContext } from "../provider/ConfigProvider";

const Dashboard = () => {
    const { signOut } = useAuthContext();

    return (
        <div className="container">
            <div className="row py-3 justify-content-between border-1 border-bottom">
                <div className="col">
                    <h3>Hatch Booking</h3>
                </div>
                <div className="col-auto">
                    <Button
                        text="Logg ut"
                        onClick={signOut}
                    />
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-lg-6">
                    <h2>Min kalender</h2>
                    <Calendar />

                    {/* <div className="mt-4">
                        <h2>Rom bookinger</h2>
                        <RoomBookings />
                    </div> */}
                </div>
                <div className="col-lg-6">
                    <h2>Brukere</h2>
                    <Users />

                    <div className="mt-4">
                        <h2>Mine rom</h2>
                        <Rooms />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Calendar = () => {
    const { user, accessToken, signIn, signOut } = useAuthContext();
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Fetch calendar events once the accessToken is available
    useEffect(() => {
        if (accessToken) {
            fetchCalendarEvents();
        }
    }, [accessToken]);

    const fetchCalendarEvents = () => {
        axios
            .get("https://graph.microsoft.com/v1.0/me/events", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setCalendarEvents(response.data.value);
            })
            .catch((error) => {
                console.error("Error fetching calendar events:", error);
            });
    };

    return (
        <div className="row">
            {calendarEvents.length > 0 ? (
                <ul>
                    {calendarEvents.map((event) => (
                        <li key={event.id}>
                            {event.subject} - {event.start.dateTime}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}

const Rooms = () => {
    const { accessToken, signIn, signOut, user } = useAuthContext();
    const { rooms, updateRooms } = useConfigContext();

    // Fetch rooms when accessToken is available
    useEffect(() => {
        if (accessToken) {
            fetchRooms();
        }
    }, [accessToken]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(
                "https://graph.microsoft.com/v1.0/places/microsoft.graph.room",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            updateRooms(response.data.value);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    return (
        <div className="row">
            {rooms && rooms.length > 0 ? (
                <ul>
                    {rooms.map((room) => (
                        <li key={room.id}>
                            <strong>{room.displayName}</strong>
                            <p>Email: {room.emailAddress}</p>
                            <p>Location: {room.streetAddress || "Not specified"}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rooms found.</p>
            )}
        </div>
    )
}

const Users = () => {
    const { accessToken } = useAuthContext();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(
                "https://graph.microsoft.com/v1.0/users",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching users: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.value); // List of users
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [accessToken]);

    return (
        <div className="row">
            {users && users.length > 0 ? (
                users.filter((user) => user.mail && user.mail.includes('@catchmedia.no')).map((user) => (
                    <div className="col-12">
                        <h5>{user.displayName}</h5>
                        <UserEvents userEmail={user.mail} />
                    </div>
                ))

            ) : (
                <p>no users</p>
            )}
        </div>
    )
}

const UserEvents = ({ userEmail }) => {
    const { accessToken } = useAuthContext();
    const [events, setEvents] = useState([]);

    const fetchUserCalendarEvents = async () => {
        try {
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/users/${userEmail}/calendar/events?$select=subject,organizer,start,end,attendees,location`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching events for ${userEmail}: ${response.status}`);
            }

            const data = await response.json();
            setEvents(data.value); // Array of events
        } catch (error) {
            console.error(`Error fetching events for ${userEmail}:`, error);
            return [];
        }
    };

    useEffect(() => {
        fetchUserCalendarEvents()
    }, [accessToken]);

    return (
        <div className="row">
            {events && events.length > 0 ? (
                events.map((event) => (
                    <div className="col-12">
                        <p>{event.subject}</p>
                    </div>
                ))
            ) : (
                <p>no events</p>
            )}
        </div>
    )
}

const RoomBookings = () => {
    const { accessToken } = useAuthContext();
    const { rooms } = useConfigContext();
    const [roomSchedules, setRoomSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchRoomAvailability = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "https://graph.microsoft.com/v1.0/me/calendar/getSchedule",
                {
                    schedules: rooms?.map((room) => room.emailAddress),
                    startTime: {
                        dateTime: new Date().toISOString(),
                        timeZone: "UTC"
                    },
                    endTime: {
                        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        timeZone: "UTC"
                    },
                    availabilityViewInterval: 60 // 1-hour intervals
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setRoomSchedules(response.data.value);
        } catch (err) {
            console.error("Error fetching room availability:", err);
            setError("Failed to fetch room availability.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken && rooms) {
            fetchRoomAvailability();
        }
    }, [accessToken, rooms]);

    console.log("Roomschedules: ", roomSchedules)

    return (
        <div className="row">
            {roomSchedules && roomSchedules.length > 0 ? (
                <ul>
                    {roomSchedules.map((room) => (
                        <li key={room.scheduleId}>
                            <h3>{room.scheduleId}</h3>

                            <RoomEvents roomEmail={room.scheduleId} />


                            {/* {room?.scheduleItems?.length > 0 ? (
                                <ul>
                                    {room.scheduleItems.map((item, index) => (
                                        <li key={index}>
                                            <strong>{item.subject}</strong>
                                            


                                            <p>
                                                {new Date(item.start.dateTime).toLocaleString()} -{" "}
                                                {new Date(item.end.dateTime).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings.</p>
                            )} */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No schedules found.</p>
            )}
        </div>
    )
}

const RoomEvents = ({ roomEmail }) => {
    const { accessToken } = useAuthContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchRoomEvents = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/users/${'greenroom@catchmedia.no'}/calendar/events`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch events.");
            }
            const data = await response.json();
            setEvents(data.value);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchRoomEvents();
        }
    }, [accessToken]);

    return (
        <div className="row">
            {events?.length > 0 ? (
                <ul>
                    {events?.map((event) => (
                        <li key={event.id}>
                            <p>
                                <strong>Meeting Name:</strong> {event.subject || "No Title"}
                            </p>
                            <p>
                                <strong>Organizer:</strong> {event.organizer?.emailAddress?.name}
                            </p>
                            <p>
                                <strong>Start:</strong>{" "}
                                {new Date(event.start.dateTime).toLocaleString("en-US", {
                                    timeZone: event.start.timeZone,
                                })}
                            </p>
                            <p>
                                <strong>End:</strong>{" "}
                                {new Date(event.end.dateTime).toLocaleString("en-US", {
                                    timeZone: event.end.timeZone,
                                })}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings for this room.</p>
            )}
        </div>
    )
}

export default Dashboard