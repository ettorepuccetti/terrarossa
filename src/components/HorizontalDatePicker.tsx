import { Box } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { useLogger } from "~/utils/logger";
import { DayCard } from "./DayCard";
import DayCardFreePicker from "./DayCardFreePicker";

export default function HorizonalDatePicker() {
  const logger = useLogger({ component: "HorizontalDatePicker" });
  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const daysInThePastVisible = clubData.clubSettings.daysInThePastVisible;
  const daysInTheFutureVisible = clubData.clubSettings.daysInFutureVisible;

  const calendarRef = useCalendarStoreContext((store) => store.calendarRef);
  const selectedDate = useCalendarStoreContext((store) => store.selectedDate);
  const setSelectedDate = useCalendarStoreContext(
    (store) => store.setSelectedDate,
  );
  const setCustomSelectedDate = useCalendarStoreContext(
    (store) => store.setCustomDateSelected,
  );

  // create an array of dates from [today - daysInThePastVisible] to [today + daysInTheFutureVisible]
  const today = dayjs().startOf("day");
  const dates: Dayjs[] = Array.from(
    {
      length: daysInThePastVisible + daysInTheFutureVisible + 1,
    },
    (_, i) => {
      return today.subtract(daysInThePastVisible, "day").add(i, "day");
    },
  );

  const onDateClick = (date: dayjs.Dayjs) => {
    logger.info({ selectedDate: date.toDate() }, "Date selected");
    setSelectedDate(date);
    setCustomSelectedDate(false);
    calendarRef.current?.getApi().gotoDate(date.toDate());
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        gap: 1,
        maxWidth: "100vw",
        paddingX: 2,
        overflowX: "scroll",
      }}
    >
      <DayCardFreePicker />
      {dates.map((day) => {
        return (
          <DayCard
            selected={selectedDate}
            key={day.toISOString()}
            day={day}
            onBoxClick={() => onDateClick(day)}
          />
        );
      })}
    </Box>
  );
}
