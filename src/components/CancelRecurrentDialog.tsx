import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import DialogLayout from "./DialogLayout";

export default function CancelRecurrentDialog(props: {
  useReservationDelete: (arg0: {
    reservationId: string;
    clubId: string;
  }) => void;
  useRecurrentReservationDelete: (arg0: {
    recurrentReservationId: string;
    clubId: string;
  }) => void;
}) {
  const deleteOpen = useCalendarStoreContext(
    (state) => state.deleteConfirmationOpen,
  );
  const setDeleteConfirmationOpen = useCalendarStoreContext(
    (state) => state.setDeleteConfirmationOpen,
  );
  const eventDetails = useCalendarStoreContext((state) => state.eventDetails);
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails,
  );
  const clubId = useCalendarStoreContext((state) => state.getClubId());

  const [value, setValue] = React.useState("single");

  const handleConfirmation = () => {
    if (!eventDetails) {
      throw new Error("Si è verificato un problema, per favore riprova.");
    }
    switch (value) {
      case "single":
        deleteReservation(eventDetails.id);
        break;
      case "recurrent":
        deleteRecurrentReservation(
          eventDetails.extendedProps.recurrentId as string,
        );
        break;
    }
    setEventDetails(null);
    setDeleteConfirmationOpen(false);
  };

  const deleteReservation = (reservationId: string) => {
    console.log("delete event: ", reservationId);
    props.useReservationDelete({
      reservationId: reservationId,
      clubId: clubId,
    });
  };

  const deleteRecurrentReservation = (recurentReservationId: string) => {
    console.log("delete recurrent event: ", recurentReservationId);
    props.useRecurrentReservationDelete({
      recurrentReservationId: recurentReservationId,
      clubId: clubId,
    });
  };

  return (
    <Dialog
      data-test="cancel-recurrent-dialog"
      open={deleteOpen && !!eventDetails?.extendedProps.recurrentId}
      onClose={() => setDeleteConfirmationOpen(false)}
    >
      <DialogLayout title="Cancellazione">
        <Alert severity="error">
          Questa prenotazione fa parte di un{"'"}ora fissa. Cosa vuoi
          cancellare?
        </Alert>
        <FormControl>
          <RadioGroup
            name="controlled-radio-buttons-group"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <FormControlLabel
              data-test="single"
              value="single"
              control={<Radio color="info" />}
              label="Prenotazione singola"
              componentsProps={{ typography: { color: "MenuText" } }}
            />
            <FormControlLabel
              data-test="recurrent"
              value="recurrent"
              control={<Radio color="info" />}
              label="Tutte le prenotazioni di questa ora fissa"
              componentsProps={{ typography: { color: "MenuText" } }}
            />
          </RadioGroup>
        </FormControl>
        <DialogActions>
          <Button
            data-test="cancel-button"
            onClick={() => setDeleteConfirmationOpen(false)}
            color="info"
          >
            Annulla
          </Button>
          <Button
            data-test="confirm-button"
            onClick={() => handleConfirmation()}
            color="error"
          >
            Conferma
          </Button>
        </DialogActions>
      </DialogLayout>
    </Dialog>
  );
}
