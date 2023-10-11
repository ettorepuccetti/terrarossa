import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { useReservationDelete } from "./Calendar";
import ConfirmationDialog from "./ConfirmationDialog";
import ErrorAlert from "./ErrorAlert";
import Spinner from "./Spinner";

export default function CancelSingleDialog() {
  const clubId = useCalendarStoreContext((state) => state.getClubId());
  const open = useCalendarStoreContext((state) => state.deleteConfirmationOpen);
  const eventDetails = useCalendarStoreContext((state) => state.eventDetails);
  const reservationDelete = useReservationDelete(clubId);
  const setDeleteConfirmationOpen = useCalendarStoreContext(
    (state) => state.setDeleteConfirmationOpen
  );
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails
  );

  const deleteReservation = (reservationId?: string) => {
    if (!reservationId) {
      throw new Error("Si è verificato un problema, per favore riprova.");
    }
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubId,
    });
    console.log("delete event: ", reservationId);
    setEventDetails(null);
    setDeleteConfirmationOpen(false);
  };

  // error handling
  if (reservationDelete.error) {
    return (
      <ErrorAlert
        error={reservationDelete.error}
        onClose={() => {
          reservationDelete.reset();
        }}
      />
    );
  }

  // loading handling
  if (reservationDelete.isLoading) {
    return <Spinner isLoading={true} />;
  }

  return (
    <>
      <ConfirmationDialog
        data-test="cancel-single-dialog"
        // if the event is recurrent, the delete dialog is handled by CancelRecurrentDialog
        open={open && !eventDetails?.extendedProps.recurrentId}
        title={"Cancellazione"}
        message={"Sei sicuro di voler cancellare la prenotazione?"}
        onConfirm={() => deleteReservation(eventDetails?.id)}
        onDialogClose={() => setDeleteConfirmationOpen(false)}
      />
    </>
  );
}
