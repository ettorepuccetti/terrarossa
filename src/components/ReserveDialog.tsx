import { Alert, Box, Button, TextField } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { type z } from "zod";
import { useMergedStoreContext } from "~/hooks/useMergedStoreContext";
import { useLogger } from "~/utils/logger";
import { isAdminOfTheClub, startDateIsFuture } from "~/utils/utils";

import {
  type RecurrentReservationInputSchema,
  type ReservationInputSchema,
} from "~/hooks/calendarTrpcHooks";
import CalendarDialog from "./CalendarDialog";
import DialogFieldGrid from "./DialogFieldGrid";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";
dayjs.extend(utc);

export default function ReserveDialog() {
  const logger = useLogger({ component: "ReserveDialog" });
  const { data: sessionData } = useSession();
  const startDate = useMergedStoreContext((store) => store.getStartDate());
  const clubData = useMergedStoreContext((store) => store.getClubData());
  const reservationAdd = useMergedStoreContext((store) =>
    store.getReservationAdd(),
  );
  const recurrentReservationAdd = useMergedStoreContext((store) =>
    store.getRecurrentReservationAdd(),
  );
  const dateClick = useMergedStoreContext((state) => state.dateClick);
  const setDateClick = useMergedStoreContext((state) => state.setDateClick);
  const endDate = useMergedStoreContext((store) => store.endDate);
  const setEndDate = useMergedStoreContext((store) => store.setEndDate);
  const endDateError = useMergedStoreContext((store) => store.endDateError);
  const recurrentEndDate = useMergedStoreContext(
    (state) => state.recurrentEndDate,
  );
  const setRecurrentEndDate = useMergedStoreContext(
    (state) => state.setRecurrentEndDate,
  );
  const recurrentEndDateError = useMergedStoreContext(
    (state) => state.recurrentEndDateError,
  );

  const setOpenReserveSuccess = useMergedStoreContext(
    (store) => store.setOpenReserveSuccess,
  );
  const [overwriteName, setOverwriteName] = useState<string | undefined>(
    undefined,
  );

  const onConfirmButton = () => {
    if (!endDate || !startDate || !dateClick?.resource) {
      logger.error("onConfirmButton: unexpected null value", {
        endDate: endDate?.toDate(),
        startDate: startDate?.toDate(),
        resource: dateClick?.resource,
      });
      throw new Error("Si è verificato un problema, per favore riprova.");
    }

    const dataPayload: z.infer<typeof ReservationInputSchema> = {
      startDateTime: startDate.toDate(),
      endDateTime: endDate.toDate(),
      overwriteName: overwriteName, //manage undefined of input for controlled component
      clubId: clubData.id,
      courtId: dateClick?.resource.id,
    };

    // recurrent reservation add. Need to convert dates to UTC for better handling in backend
    if (recurrentEndDate) {
      const recurrentDataPayload: z.infer<
        typeof RecurrentReservationInputSchema
      > = {
        ...dataPayload,
        recurrentStartDate: startDate.startOf("day").utc().toDate(),
        recurrentEndDate: recurrentEndDate.startOf("day").utc().toDate(),
      };
      logger.info("recurrent reservation added", recurrentDataPayload);
      void recurrentReservationAdd
        .mutateAsync(recurrentDataPayload)
        .then(() => {
          setOpenReserveSuccess(true);
        })
        .catch((_error) => {}); //already catched
    } else {
      // single reservation add
      logger.info("reservation added", dataPayload);
      reservationAdd
        .mutateAsync(dataPayload)
        .then(() => {
          setOpenReserveSuccess(true);
        })
        .catch((_error) => {});
    }
    setDateClick(null);
    setOverwriteName(undefined);
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  return (
    <CalendarDialog
      title="Prenota"
      dataTest="reserve-dialog"
      open={dateClick !== null}
      onClose={() => {
        setDateClick(null);
        setOverwriteName(undefined);
        setEndDate(null);
        setRecurrentEndDate(null);
      }}
    >
      {/* if not login only show "Login" button with no other fields */}
      {sessionData ? (
        <>
          {/* Static data displayed with grid style for column allignement */}
          <DialogFieldGrid
            labelValues={[
              { label: "Campo", value: dateClick?.resource?.title },
              {
                label: "Data",
                value: startDate.format("DD/MM/YYYY"),
                dataTest: "date",
              },
              {
                label: "Ora inizio",
                value: startDate.format("HH:mm"),
                dataTest: "startTime",
              },
            ]}
          />

          {/* end time */}
          <ReserveDialogEndDate clubSettings={clubData.clubSettings} />

          {/* overwrite name, only if admin mode */}
          {isAdminOfTheClub(sessionData, clubData.id) && (
            <TextField
              data-test="overwriteName"
              variant="outlined"
              placeholder="Nome"
              label="Nome prenotazione"
              value={overwriteName || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOverwriteName(e.target.value)
              }
              fullWidth
              color="info"
            />
          )}

          {/* recurrent reservation, only if admin mode */}
          <ReserveDialogRecurrent />

          {/* start date in the past warning, only for non admin */}
          {!startDateIsFuture(sessionData, clubData.id, startDate) && (
            <Box display={"flex"}>
              <Alert data-test="past-warning" severity={"warning"}>
                Non puoi prenotare una data nel passato
              </Alert>
            </Box>
          )}

          <Button
            onClick={() => void onConfirmButton()}
            disabled={
              !startDateIsFuture(sessionData, clubData.id, startDate) ||
              endDateError ||
              recurrentEndDateError
            }
            color="info"
            data-test="reserveButton"
          >
            Prenota
          </Button>
        </>
      ) : (
        <ReserveDialogLoginButton />
      )}
    </CalendarDialog>
  );
}
