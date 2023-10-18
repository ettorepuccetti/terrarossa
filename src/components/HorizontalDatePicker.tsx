import { Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import Image from "next/image";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { defaultClubImage } from "~/utils/constants";
import { capitaliseFirstChar } from "~/utils/utils";
import { DayCard } from "./DayCard";
import DayCardFreePicker from "./DayCardFreePicker";
import LegendaButton from "./LegendaButton";
import RefetchReservationButton from "./RefetchReservationButton";
require("dayjs/locale/it");
dayjs.locale("it");

export default function HorizonalDatePicker() {
  const calendarRef = useCalendarStoreContext((store) => store.calendarRef);

  const clubData = useCalendarStoreContext((state) => state.getClubData());
  const daysInThePastVisible = clubData.clubSettings.daysInThePastVisible;
  const daysInTheFutureVisible = clubData.clubSettings.daysInFutureVisible;

  const selectedDate = useCalendarStoreContext((store) => store.selectedDate);
  const setSelectedDate = useCalendarStoreContext(
    (store) => store.setSelectedDate,
  );
  const setCustomSelectedDate = useCalendarStoreContext(
    (store) => store.setCustomDateSelected,
  );

  const today = dayjs().startOf("day");
  // create an array of dates from today to today - daysInThePastVisible to today + daysInTheFutureVisible
  const dates: Dayjs[] = Array.from(
    {
      length: daysInThePastVisible + daysInTheFutureVisible + 1,
    },
    (_, i) => {
      return today.subtract(daysInThePastVisible, "day").add(i, "day");
    },
  );

  const onDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setCustomSelectedDate(false);
    calendarRef.current?.getApi().gotoDate(date.toDate());
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box position={"relative"} height={250}>
        <Image
          alt={""}
          src={clubData?.imageSrc || defaultClubImage}
          fill={true}
          style={{ objectFit: "cover" }}
        />

        {/* Horizontal scrollable list of dates - double Box needed for layout */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            left: 0,
            bottom: "-1px", // for hiding the bottom border
            backgroundImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%,  rgba(255, 255, 255, 1) 100%)", //fade to white
            height: "9rem", // to increase the fading effect
            alignItems: "flex-end",
          }}
        >
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
        </Box>
      </Box>
      {/* Row between datePicker and calendar */}
      <Box display={"flex"} paddingX={"0.5rem"}>
        {/* refresh query button */}
        <RefetchReservationButton />
        <LegendaButton />
        {/* Selected date extended */}
        <Typography
          data-test={"selected-date-extended"}
          display={"flex"}
          justifyContent={"center"}
          flexGrow={1}
          variant={"h6"}
          textAlign={"center"}
          fontWeight={300}
        >
          {capitaliseFirstChar(
            selectedDate.format("dddd DD MMMM YYYY").toLocaleLowerCase(),
          )}
        </Typography>
      </Box>
    </Box>
  );
}
