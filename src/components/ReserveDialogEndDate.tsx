import { TimePicker, type TimeValidationError } from "@mui/x-date-pickers";
import { type ClubSettings } from "@prisma/client";
import dayjs, { type Dayjs } from "dayjs";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import { startDateIsFuture } from "./ReserveDialog";

export default function ReserveDialogEndDate(props: {
  clubSettings: ClubSettings;
}) {
  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const startDate = useCalendarStoreContext((store) => store.getStartDate());
  const endDate = useCalendarStoreContext((store) => store.endDate);
  const setEndDate = useCalendarStoreContext((store) => store.setEndDate);
  const setEndDateError = useCalendarStoreContext(
    (store) => store.setEndDateError,
  );
  const { data: sessionData } = useSession();
  const [endDateErrorText, setEndDateErrorText] = useState<string | null>(null);

  return (
    <TimePicker
      slotProps={{
        textField: {
          inputProps: { "data-test": "endTime" },
          color: "info",
          helperText: endDateErrorText,
        },
      }}
      value={endDate}
      label={"Orario di fine"}
      onChange={(dayJsDate) => {
        setEndDate(dayJsDate);
        // date changed from null to not null or viceversa
        if ((endDate == null) != (dayJsDate == null)) {
          setEndDateError(dayJsDate == null);
        }
      }}
      ampm={false}
      minutesStep={30}
      skipDisabled={true}
      minTime={startDate.add(1, "hours")}
      maxTime={maxTime(
        startDate,
        sessionData,
        clubData.id,
        props.clubSettings.lastBookableHour,
        props.clubSettings.lastBookableMinute,
      )}
      disabled={!startDateIsFuture(sessionData, clubData.id, startDate)}
      autoFocus
      sx={{ width: "100%" }}
      onError={(error) => {
        setEndDateErrorText(mapEndDateErrorText(error));
        setEndDateError(error != null);
      }}
    />
  );
}

const maxTime = (
  startDate: Dayjs,
  sessionData: Session | null,
  clubId: string,
  lastBookableHour: number,
  lastBookableMinute: number,
) => {
  // default case
  const maxTime = startDate.add(2, "hours");

  // manage case in which endTime would be after club closing time
  // apply also for ADMIN
  const clubClosingTime = dayjs(startDate)
    .hour(lastBookableHour + 1) // TODO: +1 implicit assumption
    .minute(lastBookableMinute)
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
