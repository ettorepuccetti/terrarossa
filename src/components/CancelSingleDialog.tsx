import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { useLogger } from "~/utils/logger";
import ConfirmationInplace from "./ConfirmationInplace";

export default function CancelSingleDialog() {
  const logger = useLogger({
    component: "CancelSingleDialog",
  });
  const deleteConfirmationOpen = useMergedStoreContext(
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
  const reservationDelete = useMergedStoreContext((state) =>
    state.getReservationDelete(),
  );

  const deleteReservation = (reservationId?: string) => {
    if (!reservationId) {
      logger.error("reservationId is undefined", {
        eventDetails: eventDetails,
      });
      throw new Error(
        "Si è verificato un problema, la tua prentazione non può essere cancellata al momento, per favore riprova",
      );
    }
    reservationDelete.mutate({
      reservationId: reservationId,
      clubId: clubData.id,
    });
    logger.info("delete reservation", { reservationId: reservationId });
    setDeleteConfirmationOpen(false);
    setEventDetails(null);
  };

  return (
    <>
      <ConfirmationInplace
        data-test="cancel-single-dialog"
        // if the event is recurrent, the delete dialog is handled by CancelRecurrentDialog
        open={
          deleteConfirmationOpen && !eventDetails?.extendedProps.recurrentId
        }
        message={"Sei sicuro di voler cancellare la prenotazione?"}
        onConfirm={() => deleteReservation(eventDetails?.id)}
        onCancel={() => setDeleteConfirmationOpen(false)}
      />
    </>
  );
}
