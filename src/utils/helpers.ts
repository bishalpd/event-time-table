export interface TimeSlot {
  id: string; 
  label: string;
}

export interface Event {
  id: string;
  title: string;
  venueIds: string[];
  date: string; 
  start: string; 
  end: string; 
}

export const generateNext7Days = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const formatted = date.toLocaleDateString("en-GB"); // dd/mm/yyyy

    days.push({
      day: dayName,
      date: formatted.replace(/\//g, "-"), // convert dd/mm/yyyy → dd-mm-yyyy
      id: date.toISOString().split("T")[0], // yyyy-mm-dd (safe unique id)
    });
  }

  return days;
};

export const venues = [
  { id: "v1", name: "Venue 1" },
  { id: "v2", name: "Venue 2" },
  { id: "v3", name: "Venue 3" },
  { id: "v4", name: "Venue 4" },
  { id: "v5", name: "Venue 5" },
];

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const generateTimeSlots = (start = "09:00", end = "18:00", interval = 15) => {
  const slots = [];
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  for (let m = startMinutes; m < endMinutes; m += interval) {
    const h = Math.floor(m / 60).toString().padStart(2, "0");
    const min = (m % 60).toString().padStart(2, "0");
    slots.push({ id: `${h}:${min}`, label: `${h}:${min}` });
  }

  // include the last slot for end time
  const hEnd = Math.floor(endMinutes / 60).toString().padStart(2, "0");
  const minEnd = (endMinutes % 60).toString().padStart(2, "0");
  slots.push({ id: `${hEnd}:${minEnd}`, label: `${hEnd}:${minEnd}` });

  return slots;
}


export const isSlotInEvent = (
  slotId: string,
  event: Event,
  slots: TimeSlot[]
) => {
  const slotIndex = slots.findIndex((s) => s.id === slotId);
  const startIndex = slots.findIndex((s) => s.id === event.start);
  const endIndex = slots.findIndex((s) => s.id === event.end);
  if (slotIndex === -1 || startIndex === -1) return false;
  const effectiveEndIndex = endIndex === -1 ? slots.length : endIndex;
  return slotIndex >= startIndex && slotIndex < effectiveEndIndex;
};

export const getEventRowSpan = (
  slotId: string,
  event: Event,
  slots: TimeSlot[]
) => {
  const startIndex = slots.findIndex((s) => s.id === event.start);
  if (startIndex === -1) return 1;

  const startMinutes = timeToMinutes(event.start);
  const endMinutes = timeToMinutes(event.end);
  const interval = 15; 
  const rowToMerge = Math.ceil((endMinutes - startMinutes) / interval);
  return rowToMerge + 1;
};

 export const getDefaultEvents = () => {
    const today = new Date().toISOString().slice(0, 10);

    return [
      {
        id: "e1",
        title: "Event 1",
        venueIds: ["v1", "v2"],
        date: today,
        start: "09:00",
        end: "10:00",
      },
      {
        id: "e2",
        title: "Event 2",
        venueIds: ["v3"],
        date: today,
        start: "13:15",
        end: "14:30",
      },
      {
        id: "e3",
        title: "Market Boosters",
        venueIds: ["v3"],
        date: '2025-12-13',
        start: "10:30",
        end: "11:00",
      },
      {
        id: "e4",
        title: "Strategic Business Planner",
        venueIds: ["v2"],
        date: '2025-12-12',
        start: "10:30",
        end: "11:00",
      },
    ];
  };