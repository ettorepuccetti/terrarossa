import { type RefObject } from "@fullcalendar/core/preact";
import type FullCalendar from "@fullcalendar/react";
import { Box, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { capitalise, reservationConstraints } from "~/utils/constants";
import { DayCard } from "./DayCard";
require("dayjs/locale/it");
dayjs.locale("it");

export const HorizonalDatePicker = ({
  calendarRef,
  clubImg,
}: {
  calendarRef: RefObject<FullCalendar>;
  clubImg: string;
}) => {
  const today = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  // create an array of dates from today to today - daysInThePastVisible to today + daysInTheFutureVisible
  const dates: Dayjs[] = Array.from(
    { length: reservationConstraints.totalDaysVisible },
    (_, i) => {
      return today
        .subtract(reservationConstraints.dayInThePastVisible, "day")
        .add(i, "day");
    }
  );

  const onDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    calendarRef.current?.getApi().gotoDate(date.toDate());
  };

  return (
    <Box paddingBottom={2} display={"flex"} flexDirection={"column"}>
      <Box position={"relative"} height={250}>
        <Image
          alt={""}
          src={clubImg}
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
            {dates.map((day, index) => {
              return (
                <DayCard
                  selected={selectedDate}
                  key={index}
                  day={day}
                  onBoxClick={() => onDateClick(day)}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
      {/* Selected date extended */}
      <Typography variant={"h6"} textAlign={'center'}>
        {capitalise(selectedDate.format("dddd DD MMMM YYYY"))}
      </Typography>
    </Box>
  );
};
