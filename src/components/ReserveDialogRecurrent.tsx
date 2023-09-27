import { Box, Switch, Typography } from "@mui/material";
import { DatePicker, type DateValidationError } from "@mui/x-date-pickers";
import { type Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { isAdminOfTheClub } from "~/utils/utils";

export default function ReserveDialogRecurrent(props: {
  clubId: string;
  startDate: Dayjs;
  recurrentDateEventHandler: (dayJsDate: Dayjs | null) => void;
  recurrentDateErrorEventHandler: (error: boolean) => void;
  recurrentEndDate: Dayjs | null;
}) {
  const [recurrentView, setRecurrentView] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const { data: sessionData } = useSession();

  return (
    <>
      {/* swticher for recurrent reservation */}
      {isAdminOfTheClub(sessionData, props.clubId) && (
        <Box display={"flex"} gap={0.5} alignItems={"center"}>
          <Switch
            data-test="recurrent-switch"
            checked={recurrentView}
            onChange={() => {
              setRecurrentView(!recurrentView);
              props.recurrentDateErrorEventHandler(
                !recurrentView &&
                  (errorText != null || props.recurrentEndDate == null)
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
            },
          }}
          value={props.recurrentEndDate}
          label={"Data di fine validità"}
          onChange={(dayJsDate) => {
            props.recurrentDateEventHandler(dayJsDate);
            if ((props.recurrentEndDate == null) != (dayJsDate == null)) {
              // date changed from null to not null or viceversa
              props.recurrentDateErrorEventHandler(dayJsDate == null);
            }
          }}
          minDate={props.startDate}
          maxDate={props.startDate.endOf("year")}
          shouldDisableDate={(dayJsDate) =>
            dayJsDate.day() !== props.startDate.day()
          }
          onError={(error, value) => {
            props.recurrentDateErrorEventHandler(
              error != null || value == null
            );
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
