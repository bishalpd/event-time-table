import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { generateNext7Days, venues, type Event } from "../utils/helpers";

type AddEventProps = {
  open: boolean;
  onClose: () => void;
  timeSlots: {
    id: string;
    label: string;
  }[];
  allEvents: Event[];
  handleAddEvent: (event: Event) => void;
};
const AddEvent = ({
  open,
  onClose,
  timeSlots,
  allEvents,
  handleAddEvent,
}: AddEventProps) => {
  const [title, setTitle] = useState("");
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = React.useState<string>("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const days = generateNext7Days();

  const isOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ) => {
    return !(end1 <= start2 || start1 >= end2);
  };
  const canCreateEvent = (newEvent: Event, events: Event[]) => {
    const sameDateEvents = events.filter((ev) => ev.date === newEvent.date);

    // Check if any venue conflicts
    for (let ev of sameDateEvents) {
      for (let v of newEvent.venueIds) {
        if (
          ev.venueIds.includes(v) &&
          isOverlap(ev.start, ev.end, newEvent.start, newEvent.end)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleCloseSnackbar = (_?: any, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackBarOpen(false);
  };
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts[2].length === 4) {
      if (parts[0].length === 2) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateStr;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEvent = {
      id: `e${allEvents.length + 1}`,
      title,
      venueIds: selectedVenues,
      date: formatDate(date),
      start,
      end,
    };

    if (canCreateEvent(newEvent, allEvents)) {
      handleAddEvent(newEvent);
      onClose();
      setTitle("");
      setSelectedVenues([]);
      setDate(""); // reset to default date
      setStart("");
      setEnd("");
    } else {
      setSnackBarOpen(true);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={"sm"}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details to create a new event.
          </DialogContentText>
          <form id="subscription-form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Venues</InputLabel>
              <Select
                multiple
                value={selectedVenues}
                onChange={(e) => setSelectedVenues(e.target.value as string[])}
                input={<OutlinedInput label="Venues" />}
                renderValue={(selected) =>
                  selected
                    .map((id) => venues.find((v) => v.id === id)?.name)
                    .join(", ")
                }
              >
                {venues.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    <Checkbox checked={selectedVenues.includes(v.id)} />
                    <ListItemText primary={v.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Day/Time</InputLabel>
              <Select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label="Select Day/Time"
              >
                {days.map((d) => (
                  <MenuItem key={d.id} value={d.date}>
                    {d.day}({d.date})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Start Time</InputLabel>
              <Select
                value={start}
                onChange={(e) => setStart(e.target.value)}
                label="Start Time"
              >
                {timeSlots.map((t) => (
                  <MenuItem key={t.id} value={t.label}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>End Time</InputLabel>
              <Select
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                label="End Time"
              >
                {timeSlots.map((t) => (
                  <MenuItem key={t.id} value={t.label}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form="subscription-form" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Event can not be created due to conflicts ! Please try again.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddEvent;
