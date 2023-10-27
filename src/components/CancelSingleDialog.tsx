import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { loggerInternal } from "~/utils/logger";
import ConfirmationDialog from "./ConfirmationDialog";

export default function CancelSingleDialog() {
  const logger = loggerInternal.child({ component: "CancelSingleDialog" });
  const deleteConfirmationOpen = useCalendarStoreContext(
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
  const reservationDelete = useCalendarStoreContext((state) =>
    state.getReservationDelete(),
  );

  const deleteReservation = (reservationId?: string) => {
    if (!reservationId) {
      logger.error(
        { eventDetails: eventDetails },
        "reservationId is undefined",
      );
      throw new Error(
        "Si è verificato un problema, la tua prentazione non può essere cancellata al momento, per favore riprova",
      );
    }
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubData.id,
    });
    logger.info({ reservationId: reservationId }, "delete reservation");
    setDeleteConfirmationOpen(false);
    setEventDetails(null);
  };

  return (
    <>
      <ConfirmationDialog
        data-test="cancel-single-dialog"
        // if the event is recurrent, the delete dialog is handled by CancelRecurrentDialog
        open={
          deleteConfirmationOpen && !eventDetails?.extendedProps.recurrentId
        }
        title={"Cancellazione"}
        message={"Sei sicuro di voler cancellare la prenotazione?"}
        onConfirm={() => deleteReservation(eventDetails?.id)}
        onDialogClose={() => setDeleteConfirmationOpen(false)}
      />
    </>
  );
}
