import { isSlotInEvent, getEventRowSpan } from "../utils/helpers";

type EventPropsTableProps = {
  venues: {
    id: string;
    name: string;
  }[];
  timeSlots: {
    id: string;
    label: string;
  }[];
  events: {
    id: string;
    title: string;
    venueIds: string[];
    date: string;
    start: string;
    end: string;
  }[];
  selectedDate: string;
};

const EventTable = ({
  venues,
  timeSlots,
  events,
  selectedDate,
}: EventPropsTableProps) => {
  const skippedCells: Record<string, boolean> = {};
  return (
    <div className="table-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="sticky-left sticky-top"></th>
            {venues.map((v) => (
              <th key={v.id} className="sticky-top">
                {v.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {timeSlots.map((slot, rowIndex) => {
            const rowCells: React.ReactNode[] = [];

            // Time column
            rowCells.push(
              <td key={"time-" + slot.id} className="sticky-left time-cell">
                {slot.label}
              </td>
            );

            // Venue columns
            for (let colIndex = 0; colIndex < venues.length; colIndex++) {
              const v = venues[colIndex];
              const cellKey = `${slot.id}-${v.id}`;
              if (skippedCells[cellKey]) continue;

              // Find event for this slot and venue
              const event = events.find(
                (e) =>
                  e.date === selectedDate &&
                  e.venueIds.includes(v.id) &&
                  isSlotInEvent(slot.id, e, timeSlots)
              );

              if (event) {
                const venueIndex = venues.findIndex((ve) => ve.id === v.id);

                // Horizontal span
                let colSpan = 1;
                for (let i = venueIndex + 1; i < venues.length; i++) {
                  if (
                    event.venueIds.includes(venues[i].id) &&
                    isSlotInEvent(slot.id, event, timeSlots)
                  )
                    colSpan++;
                  else break;
                }

                // Vertical span
                const rowSpan = getEventRowSpan(slot.id, event, timeSlots);

                // Mark skipped cells
                timeSlots
                  .slice(rowIndex + 1, rowIndex + rowSpan)
                  .forEach((nextSlot) => {
                    for (let i = 0; i < colSpan; i++) {
                      skippedCells[
                        `${nextSlot.id}-${venues[venueIndex + i].id}`
                      ] = true;
                    }
                  });

                rowCells.push(
                  <td
                    key={v.id + slot.id}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                    style={{
                      textAlign: "center",
                      background: "#d3d3d3",
                      fontWeight: "bold",
                      cursor: "pointer",
                      minWidth: 200 * colSpan,
                      color: "#00000099",
                      fontSize: "14px",
                    }}
                  >
                    {event.start}-{event.end} <br />
                    {event.title}
                  </td>
                );

                colIndex += colSpan - 1; // skip merged columns
              } else {
                rowCells.push(
                  <td
                    key={v.id + slot.id}
                    style={{
                      cursor: "pointer",
                      minWidth: "200px",
                      maxWidth: "200px",
                    }}
                  ></td>
                );
              }
            }

            return <tr key={slot.id}>{rowCells}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
