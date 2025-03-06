import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAuthContext } from "../provider/AuthProvider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { format, addDays, subDays } from "date-fns";
import { FreeMode } from 'swiper/modules';
import { OverlayTrigger, Popover } from "react-bootstrap";
import nb from "date-fns/locale/nb";

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
        <div className="row align-items-center">
            <div className="bg-white-5 rounded-4 w-100 px-0">
                <Table
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    rooms={rooms}
                />
            </div>
        </div>
    )
}

const Table = ({ selectedDate, setSelectedDate, rooms }) => {
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

    const isBooked = (time, events) => {
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

    const findEventForTime = (time, events) => {
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

    const findNextAvailableTime = (startTime, events) => {
        let [startHours, startMinutes] = startTime.split(":").map(Number);
        let slotTime = new Date(selectedDate);
        slotTime.setHours(startHours, startMinutes, 0, 0);

        for (let i = timeSlots.indexOf(startTime) + 1; i < timeSlots.length; i++) {
            if (isBooked(timeSlots[i], events)) {
                return timeSlots[i];
            }
        }
        return timeSlots[timeSlots.length - 1];
    };

    const handleMouseDown = (e) => {
        const wrapper = e.currentTarget;
        let startX = e.pageX - wrapper.offsetLeft;
        let scrollLeft = wrapper.scrollLeft;

        const handleMouseMove = (e) => {
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="position-relative overflow-hidden">
            <div className="table-header">
                <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="btn text-light opacity-50">
                    <FontAwesomeIcon icon={["far", "chevron-left"]} />
                </button>
                <h4 className="d-inline mx-1">{format(selectedDate, "EEEE d. MMMM yyyy", { locale: nb })}</h4>
                <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="btn text-light opacity-50">
                    <FontAwesomeIcon icon={["far", "chevron-right"]} />
                </button>
            </div>
            <div className="table-wrapper" onMouseDown={handleMouseDown}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={index}>
                                <th>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4 className="text-decoration-underline unbreakable mb-0">{room.name}</h4>
                                        <div className="room-plus-box ms-5">
                                            <FontAwesomeIcon icon={["far", "plus"]} />
                                        </div>
                                    </div>
                                </th>
                                {timeSlots.map((time, index) => {
                                    const booked = isBooked(time, room.events);
                                    const event = findEventForTime(time, room.events);
                                    const isCurrentTime = time === currentTime;
                                    const nextAvailable = findNextAvailableTime(time, room.events);

                                    return (
                                        <td key={index}>
                                            <OverlayTrigger
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
                                                <div className={`time-slot ${isBooked(time, room.events) ? "booked" : ""} ${isCurrentTime ? 'fw-bold' : ''}`}>{time}</div>
                                            </OverlayTrigger>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}

                        <tr>
                            <th className="pb-5"></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Rooms;