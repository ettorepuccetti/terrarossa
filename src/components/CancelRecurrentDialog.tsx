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

export default function CancelRecurrentDialog() {
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

  const clubData = useCalendarStoreContext((state) => state.getClubData());

  const recurrentReservationDelete = useCalendarStoreContext((state) =>
    state.getRecurrentReservationDelete(),
  );
  const reservationDelete = useCalendarStoreContext((state) =>
    state.getReservationDelete(),
  );

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
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubData.id,
    });
  };

  const deleteRecurrentReservation = (recurentReservationId: string) => {
    console.log("delete recurrent event: ", recurentReservationId);
    recurrentReservationDelete.mutate({
      recurrentReservationId: recurentReservationId,
      clubId: clubData.id,
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
