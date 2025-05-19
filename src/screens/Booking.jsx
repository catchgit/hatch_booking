import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../provider/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import Numpad from "../components/Numpad";
import { useTranslation } from "react-i18next";
import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth, addMonths } from "date-fns";
import { nb } from "date-fns/locale";
import Input from "../components/Input";
import Button from "../components/Button";
import { useConfigProvider } from "../provider/ConfigProvider";

const BookingContext = createContext(null);

const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (context === null) {
        throw new Error("useBookingContext must be used within a BookingProvider")
    }
    return context;
}

const BookingProvider = ({ children }) => {
    const { apiCall } = useAuthContext();
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState({
        selectedUser: null,
        pin: null,
        details: null
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await apiCall({ action: 'getUsers' });
            if (response.status === 200) {
                setUsers(response.data);
            }
        };
        fetchUsers();
    }, []);

    return (
        <BookingContext.Provider value={{
            users,
            booking,
            loading,
            setLoading,
            selectUser: (user) => {
                setBooking(prev => ({
                    ...prev,
                    selectedUser: user
                }));

                navigate(`/${params.roomEmail}/booking/enter-pin`);
            },
        }}>
            {children}
        </BookingContext.Provider>
    )
}

export const BookingContainer = () => (
    <BookingProvider>
        <Outlet />
    </BookingProvider>
)

export const SelectUser = () => {
    const { users, selectUser } = useBookingContext();
    const params = useParams();
    const navigate = useNavigate();

    return (
        <div className="row custom-vh-100 align-items-center">
            <div className="col-md-6 mt-auto mb-5 pb-5 text-center">
                <h4 className="fw-normal">Book rom</h4>
                <h1>Velg arrangør</h1>

                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${params.roomEmail}`);
                }} className="h4 text-white fw-light d-block" style={{ marginTop: '12rem' }}>
                    Avbryt
                </a>
            </div>
            <div className="col-md-6">
                <div className="bg-white-5 px-4 py-2 rounded-3 custom-vh-90 overflow-auto">
                    {users && users
                        .filter((user) => user.hidden != true)
                        .sort((a, b) => a.displayName.localeCompare(b.displayName))
                        .map((user, index) => (
                            <User
                                key={user.id}
                                lastItem={index === users.length - 1}
                                onClick={() => selectUser(user)}
                                {...user}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}

export const EnterPin = () => {
    const { apiCall } = useAuthContext();
    const { booking } = useBookingContext();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [combination, setCombination] = useState('');
    const navigate = useNavigate();
    const params = useParams();

    const handleSubmit = async (code) => {
        setIsSubmitting(true);
        try {
            const response = await apiCall({
                action: 'verifyPin',
                pin: code,
                email: booking.selectedUser.mail
            });
            if (response.status === 200) {
                setTimeout(() => {
                    navigate(`/${params.roomEmail}/booking/details`);
                }, 1000);
            } else {
                setIsSubmitting(false);
                setCombination('');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="row custom-vh-100 align-items-center">
            <div className="col-lg-6 text-center">
                <h2 className="mb-5">{t('enter_pin')}</h2>
                <AnimatePresence mode="wait">
                    {!isSubmitting ? (
                        <motion.div
                            key="numpad"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Numpad
                                value={combination}
                                onChange={setCombination}
                                onSubmit={handleSubmit}
                                length={4}
                            />
                        </motion.div>
                    ) : null}

                    {isSubmitting && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: 100 }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear"
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    border: '5px solid #ccc',
                                    borderTop: '5px solid var(--bs-primary)'
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="col-lg-6">
                <div className="bg-white-5 px-4 py-1 rounded-4">
                    <User
                        id={booking.selectedUser.id}
                        displayName={booking.selectedUser.displayName}
                        mail={booking.selectedUser.mail}
                    />
                </div>
            </div>
        </div>
    )
}

export const BookingDetails = () => {
    const { apiCall } = useAuthContext();
    const { rooms } = useConfigProvider();
    const { booking, loading, setLoading } = useBookingContext();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookingTitle, setBookingTitle] = useState('');
    const [selectedTimeRange, setSelectedTimeRange] = useState({
        from: null,
        to: null
    });
    const days = ["MA", "TI", "ON", "TO", "FR", "LØ", "SØ"];
    const navigate = useNavigate();
    const params = useParams();

    // Generate time slots from 07:00 to 20:00
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 7; hour <= 19; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                slots.push(
                    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                );
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isTimeInRange = (time) => {
        if (!selectedTimeRange.from) return false;
        if (!selectedTimeRange.to) return time === selectedTimeRange.from;

        return time >= selectedTimeRange.from && time <= selectedTimeRange.to;
    };

    const isTimeSlotBooked = (time) => {
        if (!roomEvents) return false;
        
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        
        return roomEvents.some(event => {
            const eventStart = format(new Date(event.start), 'HH:mm');
            const eventEnd = format(new Date(event.end), 'HH:mm');
            const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
            
            return eventDate === selectedDateStr && time >= eventStart && time < eventEnd;
        });
    };

    const hasBookedSlotsInRange = () => {
        if (!selectedTimeRange.from || !selectedTimeRange.to) return false;

        // Get all time slots between from and to
        const startIndex = timeSlots.indexOf(selectedTimeRange.from);
        const endIndex = timeSlots.indexOf(selectedTimeRange.to);
        
        if (startIndex === -1 || endIndex === -1) return false;

        // Check each time slot in the range
        for (let i = startIndex; i <= endIndex; i++) {
            if (isTimeSlotBooked(timeSlots[i])) {
                return true;
            }
        }
        
        return false;
    };

    const handleTimeClick = (time) => {
        // Don't allow selection if the time slot is booked
        if (isTimeSlotBooked(time)) return;

        setSelectedTimeRange(prev => {
            // If no time is selected, start new selection
            if (!prev.from) {
                return { from: time, to: null };
            }

            // If only "from" is selected, set "to" time
            if (!prev.to) {
                // Ensure "to" is after "from"
                if (time < prev.from) {
                    return { from: time, to: prev.from };
                }
                return { from: prev.from, to: time };
            }

            // If both times are selected and clicking on a new time,
            // start a new selection
            return { from: time, to: null };
        });
    };

    const handleDateClick = (day) => {
        // Only allow selecting current or future dates
        if (format(day, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')) {
            setSelectedDate(day);
            // Reset time selection when date changes
            setSelectedTimeRange({ from: null, to: null });
        }
    };

    const isPastDate = (day) => {
        return format(day, 'yyyy-MM-dd') < format(new Date(), 'yyyy-MM-dd');
    };

    const renderMonth = (date) => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startingDayIndex = getDay(monthStart);
        const emptyDays = startingDayIndex === 0 ? 6 : startingDayIndex - 1;

        return (
            <div className="bg-white-5 px-4 rounded-4 mb-4">
                <h5 className="text-uppercase text-center pt-4 pb-3">
                    {format(date, 'MMMM yyyy', { locale: nb })}
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    {days.map((day, index) => (
                        <div key={index} className="text-white-50 text-center" style={{ width: "14.28%" }}>
                            {day}
                        </div>
                    ))}
                </div>

                <div className="d-flex flex-wrap pb-3">
                    {Array.from({ length: emptyDays }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "14.28%",
                                aspectRatio: "1",
                                padding: "10px"
                            }}
                        />
                    ))}

                    {daysInMonth.map((day) => {
                        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        const isPast = isPastDate(day);
                        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                        return (
                            <div
                                key={format(day, 'yyyy-MM-dd')}
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                    width: "14.28%",
                                    aspectRatio: "1",
                                    padding: "10px"
                                }}
                            >
                                <div
                                    className={`d-flex align-items-center justify-content-center rounded-circle ${isSelected ? 'bg-white text-body fw-medium' :
                                        isPast ? 'opacity-25' : 'bg-white-5'
                                        }`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        cursor: isPast ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => handleDateClick(day)}
                                >
                                    {format(day, 'd')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleBookingRequest = async () => {
        setLoading(true);

        try {
            const response = await apiCall({
                action: 'bookRoom',
                userId: booking.selectedUser.email,
                email: booking.selectedUser.mail,
                date: format(selectedDate, 'yyyy-MM-dd'),
                timeFrom: selectedTimeRange.from,
                timeTo: selectedTimeRange.to,
                title: bookingTitle,
                roomEmail: params.roomEmail
            });

            if (response.status === 201) {
                navigate(`/${params.roomEmail}/booking/success`);
            }
        } finally {
            setLoading(false);
        }
    }

    const roomEvents = rooms.find(room => room.email === params.roomEmail).events;

    return (
        <div className="row custom-vh-90">
            <div className="col-lg-5 custom-vh-95 overflow-auto">
                {renderMonth(new Date())}
                {renderMonth(addMonths(new Date(), 1))}
                {renderMonth(addMonths(new Date(), 2))}
            </div>
            <div className="col-lg-7 custom-vh-95 overflow-auto">
                <div className="row align-items-center gx-4">
                    <div className="col-auto">
                        <span className="fw-medium">Tittel</span>
                    </div>
                    <div className="col">
                        <Input
                            value={bookingTitle}
                            onChange={setBookingTitle}
                        />
                    </div>
                    <div className="col-auto">
                        <Button
                            text="Slett"
                            type="white-5"
                            classes="text-white"
                            leftIcon="trash"
                        />
                    </div>
                    <div className="col-auto">
                        <Button
                            text="Lagre"
                            type="white-5"
                            classes="text-white"
                            leftIcon="floppy-disk"
                            onClick={handleBookingRequest}
                            disabled={!selectedTimeRange.from || !selectedTimeRange.to || !bookingTitle || hasBookedSlotsInRange()}
                            loading={loading}
                        />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="bg-white-5 p-4 rounded-4">
                            <div className="d-flex flex-wrap justify-content-start" style={{ margin: "-2px" }}>
                                {timeSlots.map((time, index) => {
                                    const isBooked = isTimeSlotBooked(time);
                                    return (
                                        <div
                                            key={time}
                                            className={`d-flex align-items-center justify-content-center rounded-4 ${
                                                isTimeInRange(time) ? 'bg-success text-white' : 
                                                isBooked ? 'bg-danger text-white booked' : 
                                                'bg-white-5'
                                            }`}
                                            style={{
                                                width: "calc(12.5% - 4px)",
                                                aspectRatio: "1",
                                                cursor: isBooked ? "not-allowed" : "pointer",
                                                transition: "all 0.2s ease",
                                                margin: "2px",
                                                opacity: isBooked ? 0.7 : 1
                                            }}
                                            onClick={() => handleTimeClick(time)}
                                        >
                                            {time}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const User = ({ id, displayName, mail, lastItem, onClick }) => {
    return (
        <div
            className="d-flex align-items-center justify-content-between booking-user py-2 my-2"
            key={id}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <h4 className="mb-0">{displayName}</h4>
            <span className="text-white-50 fw-light">{mail}</span>
        </div>
    )
}