import { Box, Switch, Typography } from "@mui/material";
import { DatePicker, type DateValidationError } from "@mui/x-date-pickers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";

export default function ReserveDialogRecurrent() {
  const clubId = useCalendarStoreContext((state) => state.getClubId());
  const startDate = useCalendarStoreContext((state) => state.getStartDate());
  const recurrentEndDate = useCalendarStoreContext(
    (state) => state.recurrentEndDate
  );
  const setRecurrentEndDate = useCalendarStoreContext(
    (state) => state.setRecurrentEndDate
  );
  const setRecurrentEndDateError = useCalendarStoreContext(
    (state) => state.setRecurringEndDateError
  );
  const [recurrentView, setRecurrentView] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { data: sessionData } = useSession();

  return (
    <>
      {/* swticher for recurrent reservation */}
      {isAdminOfTheClub(sessionData, clubId) && (
        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Switch
            data-test="recurrent-switch"
            checked={recurrentView}
            onChange={() => {
              setRecurrentView(!recurrentView);
              setRecurrentEndDateError(
                !recurrentView &&
                  (errorText != null || recurrentEndDate == null)
              );
            }}
            color="info"
          />
          <Typography color={recurrentView ? "info" : "GrayText"}>
            Ora fissa
          </Typography>
        </Box>
      )}

      {/* recurrent reservation end date */}
      {recurrentView && (
        <DatePicker
          slotProps={{
            textField: {
              inputProps: { "data-test": "recurrent-end-date" },
              color: "info",
              helperText: errorText,
              // to enable red border on null date (but give problem in component testing):
              // set this:  `error: errorText != null || recurrentEndDate == null,`
            },
          }}
          value={recurrentEndDate}
          label={"Data di fine validità"}
          onChange={(dayJsDate) => {
            setRecurrentEndDate(dayJsDate);
            // date changed from null to not null or viceversa
            if ((recurrentEndDate == null) != (dayJsDate == null)) {
              setRecurrentEndDateError(dayJsDate == null);
            }
          }}
          minDate={startDate}
          maxDate={startDate.endOf("year")}
          shouldDisableDate={(dayJsDate) => dayJsDate.day() !== startDate.day()}
          onError={(error) => {
            setRecurrentEndDateError(error != null);
            setErrorText(mapErrorToText(error));
          }}
          views={["day"]}
          format="DD/MM/YYYY"
          sx={{ width: "100%" }}
        />
      )}
    </>
  );
}

function mapErrorToText(error: DateValidationError): string | null {
  if (!error) {
    return null;
  }
  switch (error) {
    case "minDate":
      return "La data di fine validità deve essere successiva alla data di inizio";
    case "maxDate":
      return "La data di fine validità deve essere entro la fine dell'anno";
    case "shouldDisableDate":
      return "La data deve essere lo stesso giorno della settimana della prenotazione";
    case "invalidDate":
      return "Data non valida";
    default:
      return error.toString();
  }
}
