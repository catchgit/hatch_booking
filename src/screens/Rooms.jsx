import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAuthContext } from "../provider/AuthProvider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { format, addDays, subDays } from "date-fns";
import { FreeMode } from 'swiper/modules';
import { OverlayTrigger, Popover } from "react-bootstrap";

const Rooms = () => {
    const { apiCall } = useAuthContext();
    const [rooms, setRooms] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getRooms = async () => {
        const response = await apiCall({
            action: "getRooms",
        });

        if (response.status === 200) {
            setRooms(response.data);
        }
    };

    useEffect(() => {
        getRooms();
    }, []);

    if (!rooms) return <h1>Laster...</h1>;

    return (
        <div className="bg-white-5 rounded-4">
            <div className="row align-items-center py-4">
                <div className="col-3 shadow-right"></div>
                <div className="col-9 text-center">
                    <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="btn text-light opacity-50">
                        <FontAwesomeIcon icon={["far", "chevron-left"]} />
                    </button>
                    <h3 className="d-inline mx-3">{format(selectedDate, "EEEE d. MMMM yyyy")}</h3>
                    <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="btn text-light opacity-50">
                        <FontAwesomeIcon icon={["far", "chevron-right"]} />
                    </button>
                </div>
            </div>


            {rooms.map((room, index) => (
                <div key={index} className="row align-items-center">
                    <div className="col-3 shadow-right">
                        <Room key={index} {...room} />
                    </div>

                    <div className="col-9">
                        <RoomSchedule key={index} {...room} selectedDate={selectedDate} />
                    </div>
                </div>
            ))}
        </div>
    )
}

const Room = (props) => {
    const { name } = props;

    return (
        <div className="room-box">
            <div className="d-flex align-items-center justify-content-between px-4 py-3">
                <h3 className="text-decoration-underline">{name}</h3>
                <div className="room-plus-box">
                    <FontAwesomeIcon icon={["far", "plus"]} />
                </div>
            </div>
        </div>
    );
};

const RoomSchedule = (props) => {
    const { events, selectedDate } = props;

    const generateTimeSlots = () => {
        let slots = [];
        let start = new Date(selectedDate); // Use selectedDate
        start.setHours(8, 30, 0, 0);
        let end = new Date(selectedDate); // Use selectedDate
        end.setHours(15, 30, 0, 0);

        while (start <= end) {
            slots.push(format(start, "HH:mm")); // Format as HH:MM
            start = new Date(start.getTime() + 15 * 60000);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const currentTime = format(new Date(), "HH:mm");

    const isBooked = (time) => {
        if (!events || !Array.isArray(events)) return false;

        return events.some((event) => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            const [hours, minutes] = time.split(":").map(Number);
            const slotTime = new Date(selectedDate); // Use selectedDate
            slotTime.setHours(hours, minutes, 0, 0);

            return slotTime >= eventStart && slotTime < eventEnd;
        });
    };

    const findEventForTime = (time) => {
        if (!events || !Array.isArray(events)) return null;

        const [hours, minutes] = time.split(":").map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);

        return events.find(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return slotTime >= eventStart && slotTime < eventEnd;
        });
    };

    const findNextAvailableTime = (startTime) => {
        let [startHours, startMinutes] = startTime.split(":").map(Number);
        let slotTime = new Date(selectedDate);
        slotTime.setHours(startHours, startMinutes, 0, 0);

        for (let i = timeSlots.indexOf(startTime) + 1; i < timeSlots.length; i++) {
            if (isBooked(timeSlots[i])) {
                return timeSlots[i];
            }
        }
        return timeSlots[timeSlots.length - 1]; // Return last slot if no booking ahead
    };

    return (
        <div className="d-flex gap-2">
            {timeSlots.map((time, index) => {
                const booked = isBooked(time);
                const event = findEventForTime(time);
                const isCurrentTime = time === currentTime;
                const nextAvailable = findNextAvailableTime(time);

                return (
                    <OverlayTrigger
                        key={index}
                        trigger="click"
                        rootClose
                        placement="top"
                        overlay={
                            <Popover className="bg-primary rounded-4 p-3">
                                {booked ? (
                                    <>
                                        <span className="h5 opacity-75 fw-normal">{format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}</span>
                                        <h4 className="mt-1">{event.organizer?.name}</h4>
                                        <p className="opacity-50">{event.subject}</p>
                                    </>
                                ) : (
                                    <>
                                        <span className="h5 opacity-75 fw-normal">{time} - {nextAvailable}</span>
                                        <h4 className="mt-1">Ledig</h4>
                                        <p className="opacity-50">Book rom</p>
                                    </>
                                )}

                            </Popover>
                        }
                    >
                        <div className={`time-slot ${isBooked(time) ? "booked" : ""} ${isCurrentTime ? 'fw-bold' : ''}`}>{time}</div>
                    </OverlayTrigger>
                )
            })}
        </div>
    );
};

export default Rooms;