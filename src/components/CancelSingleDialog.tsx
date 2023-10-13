import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import ConfirmationDialog from "./ConfirmationDialog";

export default function CancelSingleDialog(props: {
  useReservationDelete: (arg0: {
    reservationId: string;
    clubId: string;
  }) => void;
}) {
  const clubId = useCalendarStoreContext((state) => state.getClubId());
  const open = useCalendarStoreContext((state) => state.deleteConfirmationOpen);
  const eventDetails = useCalendarStoreContext((state) => state.eventDetails);
  // const reservationDelete = useReservationDelete(clubId);
  const setDeleteConfirmationOpen = useCalendarStoreContext(
    (state) => state.setDeleteConfirmationOpen,
  );
  const setEventDetails = useCalendarStoreContext(
    (state) => state.setEventDetails,
  );

  const deleteReservation = (reservationId?: string) => {
    if (!reservationId) {
      throw new Error("Si è verificato un problema, per favore riprova.");
    }
    props.useReservationDelete({
      reservationId: reservationId,
      clubId: clubId,
    });
    console.log("delete event: ", reservationId);
    setDeleteConfirmationOpen(false);
    setEventDetails(null);
  };

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
