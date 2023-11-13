import { type EventContentArg } from "@fullcalendar/core";
import { Avatar, Box } from "@mui/material";

/**
 * Render the calendar event containing the reservation
 * @param eventInfo
 * @returns
 */
export default function CalendarEventCard({
  eventInfo,
}: {
  eventInfo: EventContentArg;
}) {
  return (
    <Box
      // need to disable property `className={"fc-event-main"}` because it prevent applying the color text
      display={"flex"}
      gap={1}
      paddingLeft={"10px!important"}
      alignItems={"center"}
      data-test="calendar-event"
      data-id={eventInfo.event.id}
      //to replicate .fc-event-main
      position={"relative"}
      zIndex={2}
      height={"100%"}
      padding={"1px 1px 0px"}
    >
      {eventInfo.event.extendedProps.userImg && (
        <Avatar
          alt={eventInfo.event.title}
          src={eventInfo.event.extendedProps.userImg as string}
        />
      )}
      <Box maxHeight={"100%"} overflow={"hidden"}>
        <Box className="fc-event-time">{eventInfo.timeText} </Box>
        <Box
          textOverflow={"ellipsis"}
          className="fc-event-title"
          lineHeight={"22px"}
        >
          {eventInfo.event.title}
        </Box>
      </Box>
    </Box>
  );
}
