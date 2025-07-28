import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { useLogger } from "~/utils/logger";

export default function CancelRecurrentDialog() {
  const logger = useLogger({
    component: "CancelRecurrentDialog",
  });
  const deleteOpen = useMergedStoreContext(
    (state) => state.deleteConfirmationOpen,
  );
  const setDeleteConfirmationOpen = useMergedStoreContext(
    (state) => state.setDeleteConfirmationOpen,
  );
  const eventDetails = useMergedStoreContext((state) => state.eventDetails);
  const setEventDetails = useMergedStoreContext(
    (state) => state.setEventDetails,
  );

  const clubData = useMergedStoreContext((state) => state.getClubData());

  const recurrentReservationDelete = useMergedStoreContext((state) =>
    state.getRecurrentReservationDelete(),
  );
  const reservationDelete = useMergedStoreContext((state) =>
    state.getReservationDelete(),
  );

  const [value, setValue] = React.useState("single");

  const handleConfirmation = () => {
    if (!eventDetails?.id || !eventDetails.extendedProps.recurrentId) {
      logger.error("reservaton id or recurrentId is undefined", {
        eventDetails: eventDetails,
      });
      throw new Error(
        "Si è verificato un problema, la tua prentazione non può essere cancellata al momento, per favore riprova.",
      );
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
    logger.info("delete single reservation", { reservationId: reservationId });
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubData.id,
    });
  };

  const deleteRecurrentReservation = (recurentReservationId: string) => {
    logger.info("delete recurrent reservation", {
      recurrentReservationId: recurentReservationId,
    });
    recurrentReservationDelete.mutate({
      recurrentReservationId: recurentReservationId,
      clubId: clubData.id,
    });
  };

  if (!(deleteOpen && !!eventDetails?.extendedProps.recurrentId)) return null;

  return (
    <Box data-test="cancel-recurrent-dialog">
      <Alert severity="error">
        Questa prenotazione fa parte di un{"'"}ora fissa. Cosa vuoi cancellare?
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
      <Box marginTop={2} display={"flex"} justifyContent={"space-evenly"}>
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
      </Box>
    </Box>
  );
}
