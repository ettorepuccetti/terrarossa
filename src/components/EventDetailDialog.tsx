import { Alert, Button } from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import {
  type RecurrentReservationDeleteType,
  type ReservationDeleteType,
} from "~/hooks/calendarTrpcHooks";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import CalendarDialog from "./CalendarDialog";
import CancelRecurrentDialog from "./CancelRecurrentDialog";
import CancelSingleDialog from "./CancelSingleDialog";
import DialogFieldGrid from "./DialogFieldGrid";

type EventDetailDialogProps = {
  readonly reservationDelete: ReservationDeleteType;
  readonly recurrentReservationDelete: RecurrentReservationDeleteType;
};

export default function EventDetailDialog({
  reservationDelete,
  recurrentReservationDelete,
}: EventDetailDialogProps) {
  const { data: sessionData } = useSession();
  const eventDetails = useMergedStoreContext((state) => state.eventDetails);
  const setEventDetails = useMergedStoreContext(
    (state) => state.setEventDetails,
  );
  const clubData = useMergedStoreContext((state) => state.getClubData());
  const setDeleteConfirmationOpen = useMergedStoreContext(
    (state) => state.setDeleteConfirmationOpen,
  );
  const deleteConfirmationOpen = useMergedStoreContext(
    (store) => store.deleteConfirmationOpen,
  );

  /**
   * Check if the user is the admin (can delete every reservation) or the owner of the reservation
   */
  const canDelete =
    isAdminOfTheClub(sessionData, clubData.id) ||
    (sessionData?.user?.id &&
      sessionData.user.id === eventDetails?.extendedProps?.userId);

  /**
   * Check if the reservation is too close to be cancelled
   * @param startTime startTime of the reservation
   * @param hoursBeforeCancel hours before the reservation that the user can cancel it
   * @returns True if the reservation is too close to be cancelled and the user is not an admin
   */
  const tooLateToCancel = (
    startTime: Date | null | undefined,
    hoursBeforeCancel: number,
  ) => {
    return (
      dayjs(startTime).isBefore(dayjs().add(hoursBeforeCancel, "hour")) &&
      !isAdminOfTheClub(sessionData, clubData.id)
    );
  };

  return (
    <>
      <CalendarDialog
        dataTest="event-detail-dialog"
        open={eventDetails !== null}
        onClose={() => {
          setEventDetails(null);
          setDeleteConfirmationOpen(false);
        }}
        title="Prenotazione"
      >
        <DialogFieldGrid
          labelValues={[
            {
              label: "Campo",
              value: eventDetails?.getResources()[0]?.title,
              dataTest: "court-name",
            },
            {
              label: "Data",
              value: dayjs(eventDetails?.start).format("DD/MM/YYYY"),
              dataTest: "date",
            },
            {
              label: "Ora inizio",
              value: dayjs(eventDetails?.start).format("HH:mm"),
              dataTest: "startTime",
            },
            {
              label: "Ora fine",
              value: dayjs(eventDetails?.end).format("HH:mm"),
              dataTest: "endTime",
            },
          ]}
        />

        {/* alert message */}
        {canDelete &&
          tooLateToCancel(
            eventDetails?.start,
            clubData.clubSettings.hoursBeforeCancel,
          ) && (
            <Alert data-test="alert" severity="warning">
              Non puoi cancellare una prenotazione meno di{" "}
              {clubData.clubSettings.hoursBeforeCancel} ore prima del suo inizio
            </Alert>
          )}

        {/* delete button */}
        {canDelete && !deleteConfirmationOpen && (
          <Button
            onClick={() => setDeleteConfirmationOpen(true)}
            color={"error"}
            disabled={tooLateToCancel(
              eventDetails?.start,
              clubData.clubSettings.hoursBeforeCancel,
            )}
            data-test="delete-button"
          >
            Cancella
          </Button>
        )}

        {/* show recurrent confirmation dialog */}
        <CancelRecurrentDialog
          reservationDelete={reservationDelete}
          recurrentReservationDelete={recurrentReservationDelete}
        />

        {/* show confirmation dialog */}
        <CancelSingleDialog reservationDelete={reservationDelete} />
      </CalendarDialog>
    </>
  );
}
