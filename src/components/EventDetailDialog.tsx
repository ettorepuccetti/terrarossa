import { type EventImpl } from "@fullcalendar/core/internal";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  Typography,
} from "@mui/material";
import { DateField, TimeField } from "@mui/x-date-pickers";
import { type ClubSettings } from "@prisma/client";
import dayjs from "dayjs";
import { type Session } from "next-auth";
import React from "react";
import { isAdminOfTheClub } from "~/utils/utils";
import CancelRecurrentDialog from "./CancelRecurrentDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import DialogLayout from "./DialogLayout";

interface DialogProps {
  open: boolean;
  eventDetails: EventImpl | undefined;
  onDialogClose: () => void;
  sessionData: Session | null;
  onReservationDelete: (id: string) => void;
  onRecurrentReservationDelete: (id: string, futureOnly: boolean) => void;
  clubId: string;
  clubSettings: ClubSettings;
}

export default function EventDetailDialog(props: DialogProps) {
  const { open, eventDetails, sessionData, clubId, clubSettings } = props;
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  if (!eventDetails) {
    return null;
  }

  const canDelete =
    isAdminOfTheClub(sessionData, clubId) ||
    (sessionData?.user?.id &&
      sessionData.user.id === props.eventDetails?.extendedProps?.userId);

  const tooLateToCancel =
    dayjs(eventDetails.start).isBefore(
      dayjs().add(clubSettings.hoursBeforeCancel, "hour")
    ) && !isAdminOfTheClub(sessionData, clubId);

  return (
    <>
      <Dialog
        data-test="event-detail-dialog"
        open={open}
        onClose={() => props.onDialogClose()}
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

          {/* layout for the two TimeFields on the same row */}
          <Box display={"flex"} gap={1}>
            {/* time start */}
            <TimeField
              data-test="startTime"
              color="info"
              value={eventDetails.start}
              label={"Orario di inizio"}
              readOnly={true}
              ampm={false}
            />
            {/* time end */}
            <TimeField
              data-test="endTime"
              color="info"
              value={eventDetails.end}
              label={"Orario di fine"}
              readOnly={true}
              ampm={false}
            />
          </Box>

          {/* alert message */}
          {canDelete && tooLateToCancel && (
            <Alert data-test="alert" severity="warning">
              Non puoi cancellare una prenotazione meno di{" "}
              {clubSettings.hoursBeforeCancel} ore prima del suo inizio
            </Alert>
          )}

          {/* delete button */}
          {canDelete && (
            <Button
              onClick={() => setConfirmationOpen(true)}
              color={"error"}
              disabled={tooLateToCancel}
              data-test="delete-button"
            >
              Cancella
            </Button>
          )}

          {eventDetails.extendedProps.recurrentId && (
            <CancelRecurrentDialog
              open={confirmationOpen}
              onDialogClose={() => setConfirmationOpen(false)}
              onCancelSingle={() => {
                props.onReservationDelete(eventDetails.id);
                setConfirmationOpen(false);
              }}
              onCancelRecurrent={() => {
                props.onRecurrentReservationDelete(
                  eventDetails.extendedProps.recurrentId as string,
                  false
                );
                setConfirmationOpen(false);
              }}
              OnCancelFutures={() => {
                props.onRecurrentReservationDelete(
                  eventDetails.extendedProps.recurrentId as string,
                  true
                );
                setConfirmationOpen(false);
              }}
            />
          )}

          {!eventDetails.extendedProps.recurrentId && (
            <ConfirmationDialog
              open={confirmationOpen}
              title={"Cancellazione"}
              message={"Sei sicuro di voler cancellare la prenotazione?"}
              onDialogClose={() => setConfirmationOpen(false)}
              onConfirm={() => {
                props.onReservationDelete(eventDetails.id);
                setConfirmationOpen(false);
              }}
            />
          )}
        </DialogLayout>
      </Dialog>
    </>
  );
}
