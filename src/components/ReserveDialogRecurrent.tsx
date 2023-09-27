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
  const [errorText, setErrorText] = useState<string | null>(
    "Inserisci una data valida"
  );
  const { data: sessionData } = useSession();

  function manageErrorTextAndState(
    error: DateValidationError,
    switchValue?: boolean
  ) {
    // invoked by switchButton change
    if (switchValue != undefined) {
      if (switchValue == true) {
        //send the error, if present
        props.recurrentDateErrorEventHandler(errorText != null);
      }

      if (switchValue == false) {
        //clear the error, but not the error text
        props.recurrentDateErrorEventHandler(false);
      }
    } else {
      // invoked by error on date change, error could be null if the data became valid
      setErrorText(mapErrorToText(error));
      props.recurrentDateErrorEventHandler(error != null);
    }
  }

  function mapErrorToText(error: DateValidationError): string | null {
    let returnString;
    if (!error) {
      return null;
    }
    switch (error) {
      case "minDate":
        returnString =
          "La data di fine validità deve essere successiva alla data di inizio";
        break;
      case "maxDate":
        returnString =
          "La data di fine validità deve essere entro la fine dell'anno";
        break;
      case "shouldDisableDate":
        returnString =
          "La data deve essere lo stesso giorno della settimana della prenotazione";
        break;
      case "invalidDate":
        returnString = "Data non valida";
        break;
      default:
        returnString = error.toString();
    }
    return returnString;
  }

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
              manageErrorTextAndState(null, !recurrentView);
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
          }}
          minDate={props.startDate}
          maxDate={props.startDate.endOf("year")}
          shouldDisableDate={(dayJsDate) =>
            dayJsDate.day() !== props.startDate.day()
          }
          onError={(error) => {
            manageErrorTextAndState(error);
          }}
          views={["day"]}
          format="DD/MM/YYYY"
          sx={{ width: "100%" }}
        />
      )}
    </>
  );
}
