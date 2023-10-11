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
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { isAdminOfTheClub } from "~/utils/utils";
import { useClubQuery } from "./Calendar";
import CancelRecurrentDialog from "./CancelRecurrentDialog";
import CancelSingleDialog from "./CancelSingleDialog";
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
  const clubQuery = useClubQuery(clubId);
  const setDeleteConfirmationOpen = useCalendarStoreContext(
    (state) => state.setDeleteConfirmationOpen
  );

  const canDelete =
    isAdminOfTheClub(sessionData, clubId) ||
    (sessionData?.user?.id &&
      sessionData.user.id === eventDetails?.extendedProps?.userId);

  const tooLateToCancel = (
    startTime: Date | null | undefined,
    hoursBeforeCancel: number
  ) => {
    return (
      dayjs(startTime).isBefore(dayjs().add(hoursBeforeCancel, "hour")) &&
      !isAdminOfTheClub(sessionData, clubId)
    );
  };

  // error handling
  if (clubQuery.error) {
    return (
      <ErrorAlert
        error={clubQuery.error}
        onClose={() => {
          void clubQuery.refetch();
        }}
      />
    );
  }

  // loading handling
  if (clubQuery.isLoading) {
    return <Spinner isLoading={true} />;
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
              {eventDetails?.getResources()[0]?.title}
            </Typography>
          </DialogActions>

          {/* date (day) */}
          <DateField
            data-test="date"
            color="info"
            value={dayjs(eventDetails?.start)}
            readOnly={true}
            label={"Data"}
            format="DD/MM/YYYY"
            fullWidth
          />

          {/* time start */}
          <TimeField
            data-test="startTime"
            color="info"
            value={eventDetails?.start}
            label={"Orario di inizio"}
            readOnly={true}
            ampm={false}
            fullWidth
          />
          {/* time end */}
          <TimeField
            data-test="endTime"
            color="info"
            value={eventDetails?.end}
            label={"Orario di fine"}
            readOnly={true}
            ampm={false}
            fullWidth
          />

          {/* alert message */}
          {canDelete &&
            tooLateToCancel(
              eventDetails?.start,
              clubQuery.data.clubSettings.hoursBeforeCancel
            ) && (
              <Alert data-test="alert" severity="warning">
                Non puoi cancellare una prenotazione meno di{" "}
                {clubQuery.data.clubSettings.hoursBeforeCancel} ore prima del
                suo inizio
              </Alert>
            )}

          {/* delete button */}
          {canDelete && (
            <Button
              onClick={() => setDeleteConfirmationOpen(true)}
              color={"error"}
              disabled={tooLateToCancel(
                eventDetails?.start,
                clubQuery.data.clubSettings.hoursBeforeCancel
              )}
              data-test="delete-button"
            >
              Cancella
            </Button>
          )}

          {/* show recurrent confirmation dialog */}
          <CancelRecurrentDialog />

          {/* show confirmation dialog */}
          <CancelSingleDialog />
        </DialogLayout>
      </Dialog>
    </>
  );
}
