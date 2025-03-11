import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthContext } from '../provider/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Button from '../components/Button';

const Room = () => {
    const { apiCall } = useAuthContext();
    const { roomId } = useParams();
    const [events, setEvents] = useState({});
    const [currentEvent, setCurrentEvent] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [totalEventDuration, setTotalEventDuration] = useState(0);
    const [countdownDuration, setCountdownDuration] = useState(0);

    const fetchEvents = async () => {
        try {
            const response = await apiCall({
                action: 'getRoom',
                room: roomId
            });

            if (response.status === 200) {
                const eventsData = response.data;
                setEvents(eventsData);
                await fetchCurrentEvents();
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoaded(true);
        }
    }

    const fetchCurrentEvents = async () => {
        try {
            const response = await apiCall({
                action: 'getCurrentEvent',
                room: roomId
            });

            if (response.status === 200) {
                const eventsData = response.data;
                setCurrentEvent(eventsData[0])
                const { totalDuration, remainingTime } = getCountdownDuration(eventsData);
                setCountdownDuration(remainingTime);
                setTotalEventDuration(totalDuration);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getCountdownDuration = (events) => {
        const now = new Date().getTime(); // Current time in milliseconds

        // Iterate through events
        for (let event of events) {
            const startTime = new Date(event.start.dateTime).getTime();
            const endTime = new Date(event.end.dateTime).getTime();

            // Check if the event is currently ongoing
            if (now >= startTime && now <= endTime) {
                // Total duration in seconds (properly calculated)
                const totalDuration = (endTime - startTime) / 1000; // In seconds

                // Remaining time in seconds, ensure it's not negative
                const remainingTime = Math.max(Math.floor((endTime - now) / 1000), 0); // Remaining time in seconds

                // Return both total and remaining time for countdown
                return {
                    totalDuration,
                    remainingTime,
                };
            }
        }

        // Default return value when no event is ongoing
        return {
            totalDuration: 0,
            remainingTime: 0
        };
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    if (!loaded) return <h1>Laster...</h1>

    return (
        <div className="row align-items-center gx-5 custom-vh-100 overflow-hidden">
            <div className="col-lg-6 d-flex align-items-center justify-content-center custom-vh-100">
                <Countdown
                    totalDuration={totalEventDuration}
                    remainingTime={countdownDuration}
                    currentEvent={currentEvent}
                />
            </div>

            <div className="col-lg-6 custom-vh-100 overflow-auto">
                {Object.keys(events).length > 0 ? (
                    Object.entries(events).map(([date, items], index) => (
                        <div key={date} className="mb-4">
                            <h4 className="text-uppercase small opacity-50 px-4">{date}</h4>
                            <div className="bg-white-5 p-4 rounded-3">
                                {items.map((event, idx) => (
                                    <Event
                                        key={idx}
                                        firstItem={index === 0}
                                        lastItem={idx === items.length - 1}
                                        {...event}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Ingen møter</p>
                )}
            </div>
        </div>

    )
}

const Event = (props) => {
    const { firstItem, lastItem, start, end, subject, organizer } = props;

    return (
        <div className={!lastItem ? 'mb-4' : ''}>
            <div className={`d-flex align-items-center gap-2 ${!firstItem ? 'opacity-75' : ''}`}>
                <span className="fw-medium">{format(start, 'HH:mm')}</span>
                <FontAwesomeIcon icon={["far", "arrow-right"]} />
                <span className="fw-medium">{format(end, 'HH:mm')}</span>
            </div>
            <h4 className={`mb-1 ${!firstItem ? 'opacity-50' : ''}`}>{organizer.name}</h4>
            <span className={`fw-light ${!firstItem ? 'opacity-25' : 'opacity-75'}`}>{subject.replace(organizer.name, '')}</span>
        </div>
    )
}

const Countdown = ({ totalDuration, remainingTime, currentEvent }) => {
    const countdownRef = useRef(null);
    const [size, setSize] = useState(100);

    useEffect(() => {
        if (!countdownRef.current) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setSize(entry.contentRect.width);
            }
        });

        observer.observe(countdownRef.current);

        return () => observer.disconnect();
    }, []);

    console.log(currentEvent)

    return (
        <div ref={countdownRef} className="w-100 position-relative d-flex justify-content-center">
            <CountdownCircleTimer
                isPlaying
                duration={totalDuration}
                initialRemainingTime={remainingTime}
                rotation="counterclockwise"
                size={size > 800 ? 800 : size}
                strokeWidth={17}
                colors={remainingTime ? 'var(--bs-danger)' : 'var(--bs-success)'}
                trailColor="rgba(0, 0, 0, .5)"
            >
                {({ remainingTime }) => (
                    <div className="row align-items-center text-center">
                        <h1 className="fw-bold opacity-75 text-uppercase">{remainingTime ? 'Opptatt' : 'Ledig'}</h1>
                        {remainingTime ? (
                            <>
                                <span className="countdown-time fw-semibold">{formatTime(remainingTime)}</span>
                                <h3>{currentEvent.organizer?.emailAddress?.name}</h3>
                                <h4 className="fw-light text-white-75">{currentEvent.subject.replace(currentEvent.organizer?.emailAddress?.name, '')}</h4>
                            </>
                        ) : (
                            <div className="d-flex flex-column align-items-center mt-3 mb-5">
                                <div className="round-add-button p-5">
                                    <FontAwesomeIcon icon={["far", "plus"]} size="4x" />
                                </div>

                                <div className="position-absolute bottom-0 mb-5">
                                    <Button
                                        text="Book rom"
                                        type="white"
                                        leftIcon="plus"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                )
                }
            </CountdownCircleTimer >
        </div >
    );
};

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Get hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get minutes
    const remainingSeconds = seconds % 60; // Get remaining seconds

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default Room;
