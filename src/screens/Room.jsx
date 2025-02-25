import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthContext } from '../provider/AuthProvider';

const Room = () => {
    const { apiCall } = useAuthContext();
    const { roomId } = useParams();
    const [timeLeft, setTimeLeft] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [events, setEvents] = useState([]);
    const svgRef = useRef(null);

    const fetchEvents = async () => {
        try {
            const response = await apiCall({
                action: 'getRoom',
                email: 'blueroom@catchmedia.no'
            });

            if (response.status === 200) {
                console.log(response.data)
                setEvents(response.data)
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const getCurrentEvent = () => {
        const now = new Date();
        return events.find(event => {
            const startTime = new Date(event.start);
            const endTime = new Date(event.end);
            return now >= startTime && now <= endTime;
        });
    };

    useEffect(() => {
        if (events.length === 0) return;

        const currentEvent = getCurrentEvent();

        if (!currentEvent) {
            setIsComplete(true);
            setTimeLeft(0);
            return;
        }

        const startTime = new Date(currentEvent.start);
        const endTime = new Date(currentEvent.end);
        const totalDuration = endTime - startTime;

        const timer = setInterval(() => {
            const currentTime = new Date();
            const difference = endTime - currentTime;

            if (difference <= 0) {
                setIsComplete(true);
                setTimeLeft(0);
                clearInterval(timer);
                return;
            }

            setIsComplete(false);
            setTimeLeft(difference / 1000);
        }, 16);

        return () => clearInterval(timer);
    }, [events]);

    // Calculate circumference based on current SVG size
    const getCircumference = () => {
        if (!svgRef.current) return 0;
        const radius = 45; // Using viewBox coordinates
        return 2 * Math.PI * radius;
    };

    const circumference = getCircumference();
    // Calculate progress based on 2 hours (7200 seconds)
    const offset = circumference - (timeLeft / 7200) * circumference;

    // Format the remaining time
    const formatTimeLeft = () => {
        if (timeLeft <= 0) return "00:00:00";
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = Math.floor(timeLeft % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentEvent = getCurrentEvent();
    const getTimeDisplay = () => {
        if (!currentEvent) return "Room Available";
        const start = new Date(currentEvent.start);
        const end = new Date(currentEvent.end);
        return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Room {roomId}</h1>
            <div className="row">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="position-relative w-100" style={{ aspectRatio: '1/1' }}>
                        <svg ref={svgRef} className="position-absolute w-100 h-100" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth="4"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke={isComplete ? "#4CAF50" : "#FF5252"}
                                strokeWidth="4"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                            <h2>{currentEvent?.subject}</h2>
                            <h3 className="m-0" style={{ fontSize: '2.5rem !important' }}>
                                {currentEvent ? formatTimeLeft() : "Available"}
                            </h3>
                            <small className="text-white-50">{getTimeDisplay()}</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    {events?.map((event, index) => (
                        <div key={index}>
                            <h3>{event.subject}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Room;
