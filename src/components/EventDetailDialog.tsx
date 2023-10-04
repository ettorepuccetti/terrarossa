import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  Typography,
} from "@mui/material";
import { DateField, TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React from "react";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import {
  useClubQuery,
  useRecurrentReservationDelete,
  useReservationDelete,
} from "./Calendar";
import CancelRecurrentDialog from "./CancelRecurrentDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import DialogLayout from "./DialogLayout";
import ErrorAlert from "./ErrorAlert";
import Spinner from "./Spinner";

export default function EventDetailDialog() {
  const eventDetails = useCalendarStoreContext((state) => state.eventDetails);
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails
  );
  const clubId = useCalendarStoreContext((state) => state.getClubId());
  const { data: sessionData } = useSession();
  const reservationDelete = useReservationDelete(clubId);
  const recurrentReservationDelete = useRecurrentReservationDelete(clubId);
  const clubQuery = useClubQuery(clubId);
  const clubSettings = clubQuery.data?.clubSettings;
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  const canDelete =
    isAdminOfTheClub(sessionData, clubId) ||
    (sessionData?.user?.id &&
      sessionData.user.id === eventDetails?.extendedProps?.userId);

  const tooLateToCancel = (startTime: Date | null) => {
    if (!startTime || !clubSettings?.hoursBeforeCancel) {
      throw new Error("Si è verificato un problema, per favore riprova.");
    }
    return (
      dayjs(startTime).isBefore(
        dayjs().add(clubSettings.hoursBeforeCancel, "hour")
      ) && !isAdminOfTheClub(sessionData, clubId)
    );
  };

  const deleteReservation = (reservationId: string) => {
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubId,
    });
    console.log("delete event: ", reservationId);
    setEventDetails(null);
    setConfirmationOpen(false);
  };

  // error handling
  if (reservationDelete.error || recurrentReservationDelete.error) {
    return (
      <ErrorAlert
        error={reservationDelete.error ?? recurrentReservationDelete.error}
        onClose={() => {
          reservationDelete.error && reservationDelete.reset();
          recurrentReservationDelete.error &&
            recurrentReservationDelete.reset();
        }}
      />
    );
  }

  // loading handling
  if (reservationDelete.isLoading || recurrentReservationDelete.isLoading) {
    return <Spinner isLoading={true} />;
  }

  // only for linting
  if (!eventDetails) {
    return null;
  }

  return (
    <>
      <Dialog
        data-test="event-detail-dialog"
        open={eventDetails !== null}
        onClose={() => setEventDetails(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogLayout title="Prenotazione">
          {/* Court name */}
          <DialogActions>
            <Typography gutterBottom data-test="court-name">
              {eventDetails.getResources()[0]?.title}
            </Typography>
          </DialogActions>

          {/* date (day) */}
          <DateField
            data-test="date"
            color="info"
            value={dayjs(eventDetails.start)}
            readOnly={true}
            label={"Data"}
            format="DD/MM/YYYY"
            fullWidth
          />

          {/* time start */}
          <TimeField
            data-test="startTime"
            color="info"
            value={eventDetails.start}
            label={"Orario di inizio"}
            readOnly={true}
            ampm={false}
            fullWidth
          />
          {/* time end */}
          <TimeField
            data-test="endTime"
            color="info"
            value={eventDetails.end}
            label={"Orario di fine"}
            readOnly={true}
            ampm={false}
            fullWidth
          />

          {/* alert message */}
          {canDelete && tooLateToCancel(eventDetails.start) && (
            <Alert data-test="alert" severity="warning">
              Non puoi cancellare una prenotazione meno di{" "}
              {clubSettings?.hoursBeforeCancel} ore prima del suo inizio
            </Alert>
          )}

          {/* delete button */}
          {canDelete && (
            <Button
              onClick={() => setConfirmationOpen(true)}
              color={"error"}
              disabled={tooLateToCancel(eventDetails.start)}
              data-test="delete-button"
            >
              Cancella
            </Button>
          )}

          {/* show recurrent confirmation dialog */}
          {eventDetails?.extendedProps.recurrentId && (
            <CancelRecurrentDialog
              open={confirmationOpen}
              onDialogClose={() => setConfirmationOpen(false)}
              onCancelSingle={() => deleteReservation(eventDetails.id)}
              onCancelRecurrent={() => {
                recurrentReservationDelete.mutate({
                  recurrentReservationId: eventDetails.extendedProps
                    .recurrentId as string,
                  clubId: clubId,
                });
                console.log(
                  "delete recurrent event: ",
                  eventDetails.extendedProps.recurrentId
                );
                setEventDetails(null);
                setConfirmationOpen(false);
              }}
            />
          )}

          {/* show confirmation dialog */}
          {!eventDetails?.extendedProps.recurrentId && (
            <ConfirmationDialog
              open={confirmationOpen}
              title={"Cancellazione"}
              message={"Sei sicuro di voler cancellare la prenotazione?"}
              onDialogClose={() => setConfirmationOpen(false)}
              onConfirm={() => deleteReservation(eventDetails.id)}
            />
          )}
        </DialogLayout>
      </Dialog>
    </>
  );
}
