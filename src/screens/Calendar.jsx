import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import '../App.css';
import "react-big-calendar/lib/css/react-big-calendar.css";

// React calendar: npm install react-big-calendar
// Remove CRUD to use locally

const localizer = momentLocalizer(moment);

function TestMicrosoftGraph() {
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);  // New state to store the selected event
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const clientID = ""// Insert client ID here
  const tenantID = ""// Insert Tenant ID here
  const clientSecret ="" // Insert secret key here

  const getAccessToken = async () => {
    try {
      const url = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientID,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
      });

      const response = await fetch(url, {
        method: "POST",
        body: params,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }

      const data = await response.json();
      setToken(data.access_token);
      console.log("Access Token:", data.access_token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const getUsers = async () => {
    if (!token) {
      console.error("No token found. Please fetch the token first.");
      return;
    }

    try {
      const url = "https://graph.microsoft.com/v1.0/users";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.value);
      console.log("Users:", data.value);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getAllUserEvents = async () => {
    if (!token) {
      console.error("No token found. Please fetch the token first.");
      return;
    }

    try {
      let allEvents = [];
      for (let user of users) {
        const userEmail = user.mail || user.userPrincipalName;
        const startTime = new Date().toISOString();
        const endTime = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString();

        const url = `https://graph.microsoft.com/v1.0/users/${userEmail}/calendarView?startDateTime=${startTime}&endDateTime=${endTime}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch events for ${userEmail}`);
          continue;
        }

        const data = await response.json();

        const filteredEvents = data.value.filter((event) => {
          const location = event.location;
          return location && location.displayName && location.displayName.trim() !== "";
        });

        allEvents = [...allEvents, ...filteredEvents];
      }

      const uniqueEvents = [];
      const eventKeys = new Set();

      allEvents.forEach((event) => {
        const location = event.location.displayName;
        const eventKey = `${location}-${event.start.dateTime}-${event.end.dateTime}`;

        if (!eventKeys.has(eventKey)) {
          eventKeys.add(eventKey);
          uniqueEvents.push(event);
        }
      });

      setEvents(uniqueEvents);
      console.log("Filtered & Unique Events by Location:", uniqueEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: `${event.location.displayName} - ${event.subject}`,
    start: new Date(event.start.dateTime),
    end: new Date(event.end.dateTime),
  }));

const handleEventClick = (event) => {
  console.log("Selected Event: ", event); // Check if the event is being selected correctly
};


  return (
    <div>
      <p>User, email - events</p>
      <p>User, rooms - events</p>
      <p>Filter location/start/end</p>
      <p>rbc.event</p>

      <button onClick={getAccessToken}>Fetch Access Token</button>
      {token && <button onClick={getUsers}>Fetch Users</button>}
      {users.length > 0 && <button onClick={getAllUserEvents}>Fetch All User Events</button>}

      <div style={{ height: 500, margin: "20px 0" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          min={new Date(2024, 0, 1, 8, 0)} // 08:00 AM
          max={new Date(2024, 0, 1, 16, 0)} // 04:00 PM
          formats={{
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, "HH:mm", culture), // Show "08:00", "09:00", etc.
          }}
          onSelectEvent={handleEventClick}  // Add onSelectEvent to handle clicks
        />
      </div>
    </div>
  );
}

export default TestMicrosoftGraph;
