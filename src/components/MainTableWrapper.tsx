import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";
import {
  generateNext7Days,
  venues,
  generateTimeSlots,
  type Event,
  getDefaultEvents,
} from "../utils/helpers";
import EventTable from "./EventTable";

const MainTableWrapper = () => {
  const days = generateNext7Days();
  const slots = generateTimeSlots();
  const todayId = new Date().toISOString().split("T")[0];
  const initialValue = days.find((d) => d.id === todayId)?.id || days[0].id;
  const [value, setValue] = useState(initialValue);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const handleChangeDay = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue.toString());
    let tempAllEvents = [...allEvents];
    tempAllEvents = tempAllEvents.filter(
      (ev: Event) => ev.date === newValue.toString()
    );
    setEvents(tempAllEvents);
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem("events");
    let loadedEvents = stored ? JSON.parse(stored) : getDefaultEvents();
    const todaysEvents = loadedEvents.filter((ev: Event) => ev.date === today);
    setEvents(todaysEvents);
    setAllEvents(loadedEvents);
  }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ margin: "40px 0", padding: "15px 0" }}>
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" component="h4">
            Event Time Table
          </Typography>
        </div>

        <Box sx={{ margin: "15px" }}>
          <Tabs
            value={value}
            onChange={handleChangeDay}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            {days.map((item) => (
              <Tab
                key={item.id}
                value={item.id}
                label={
                  <>
                    <div>{item.day}</div>
                    <small>Date: {item.date}</small>
                  </>
                }
              />
            ))}
          </Tabs>
          <EventTable
            venues={venues}
            timeSlots={slots}
            events={events}
            selectedDate={value.toString()}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default MainTableWrapper;
