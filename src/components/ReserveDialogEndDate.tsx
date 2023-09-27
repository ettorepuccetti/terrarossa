import { TimePicker, type TimeValidationError } from "@mui/x-date-pickers";
import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { isAdminOfTheClub } from "~/utils/utils";

export default function ReserveDialogEndDate(props: {
  endDate: Dayjs | null;
  startDate: Dayjs;
  clubId: string;
  clubSettings: ClubSettings;
  disabled: boolean;
  endDateEventHandler: (dayJsDate: Dayjs | null) => void;
  endDateErrorEventHandler: (error: boolean) => void;
}) {
  const { startDate, endDateEventHandler } = props; // for using them inside useEffect
  const { data: sessionData } = useSession();
  const [endDateErrorText, setEndDateErrorText] = useState<string | null>(null);

  // to set endDate to startDate + 1 hour, when component is mounted
  useEffect(() => {
    if (!startDate) {
      return;
    }
    endDateEventHandler(
      dayjs(startDate).add(1, "hours").set("second", 0).set("millisecond", 0)
    );
  }, [startDate, endDateEventHandler]);

  return (
    <TimePicker
      slotProps={{
        textField: {
          inputProps: { "data-test": "endTime" },
          color: "info",
          helperText: endDateErrorText,
        },
      }}
      value={props.endDate}
      label={"Orario di fine"}
      onChange={(dayJsDate) => props.endDateEventHandler(dayJsDate)}
      ampm={false}
      minutesStep={30}
      skipDisabled={true}
      minTime={props.startDate.add(1, "hours")}
      maxTime={maxTime(
        props.startDate,
        sessionData,
        props.clubId,
        props.clubSettings
      )}
      disabled={props.disabled}
      autoFocus
      sx={{ width: "100%" }}
      onError={(error) => {
        setEndDateErrorText(mapEndDateErrorText(error));
        props.endDateErrorEventHandler(error != null);
      }}
    />
  );
}

const maxTime = (
  startDate: Dayjs,
  sessionData: Session | null,
  clubId: string,
  clubSettings: ClubSettings
) => {
  // default case
  const maxTime = startDate.add(2, "hours");

  // manage case in which endTime would be after club closing time
  // apply also for ADMIN
  const clubClosingTime = dayjs(startDate)
    .hour(clubSettings.lastBookableHour + 1) // TODO: +1 implicit assumption
    .minute(clubSettings.lastBookableMinute)
    .second(0)
    .millisecond(0);
  if (maxTime.isAfter(clubClosingTime)) {
    return clubClosingTime;
  }

  // manage ADMIN case, free to book as much as he wants
  if (isAdminOfTheClub(sessionData, clubId)) {
    return undefined;
  }

  // manage case in which endTime would be the next day (so end time before start time)
  // TODO: useless because club closing time should be before midnight
  if (maxTime.day() !== startDate.day()) {
    return startDate.endOf("day");
  }

  return maxTime;
};

const mapEndDateErrorText = (error: TimeValidationError): string | null => {
  if (!error) {
    return null;
  }
  switch (error) {
    case "minutesStep":
    case "minTime":
      return "Prenota 1 ora, 1 ora e mezzo o 2 ore";
    case "maxTime":
      return "Prenota al massimo 2 ore. Rispetta l'orario di chiusura del circolo";
    default:
      return error.toString();
  }
};
