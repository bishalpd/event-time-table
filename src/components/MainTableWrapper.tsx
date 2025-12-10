import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, Container, Typography } from "@mui/material";
import {
  generateNext7Days,
  venues,
  generateTimeSlots,
  type Event,
  getDefaultEvents,
} from "../utils/helpers";
import EventTable from "./EventTable";
import AddEvent from "./AddEvent";

const MainTableWrapper = () => {
  const days = generateNext7Days();
  const slots = generateTimeSlots();
  const todayId = new Date().toISOString().split("T")[0];
  const initialValue = days.find((d) => d.id === todayId)?.id || days[0].id;
  const [value, setValue] = useState(initialValue);
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);

  const handleChangeDay = (_: any, newValue: number) => {
    setValue(newValue.toString());
    let tempAllEvents = [...allEvents];
    tempAllEvents = tempAllEvents.filter(
      (ev: Event) => ev.date === newValue.toString()
    );
    setEvents(tempAllEvents);
  };

  const setTodaysEvent = (allEvents: Event[], value: string) => {
    let tempAllEvents = [...allEvents];
    tempAllEvents = tempAllEvents.filter(
      (ev: Event) => ev.date === value.toString()
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

  const handleAddEvent = (event: Event) => {
    const updatedEvents = [...allEvents, event];
    setAllEvents(updatedEvents);
    setTodaysEvent(updatedEvents, value);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <>
      <Container maxWidth="md">
        <Paper sx={{ margin: "40px 0", padding: "15px 0" }}>
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4" component="h4">
              Event Time Table
            </Typography>
          </div>

          <Box sx={{ margin: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginBottom: "8px",
              }}
            >
              <Button variant="contained" onClick={() => setOpen(true)}>
                Add Event
              </Button>
            </div>
            <Tabs
              value={value}
              onChange={handleChangeDay}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
              className="fullwidth-scroll-tabs"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{ border: "1px solid #d3d3d3" }}
            >
              {days.map((item) => (
                <Tab
                  sx={{
                    "&.Mui-selected": {
                      background: "#d3d3d3",
                      color: "#00000099",
                    },
                    border: "1px solid #d3d3d3",
                    borderBottom: "0px",
                  }}
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
      <AddEvent
        open={open}
        onClose={() => setOpen(false)}
        timeSlots={slots}
        allEvents={allEvents}
        handleAddEvent={handleAddEvent}
      />
    </>
  );
};

export default MainTableWrapper;
