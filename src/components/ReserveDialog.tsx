import { Alert, Box, Button, Dialog, TextField } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { type z } from "zod";
import { useCalendarStoreContext } from "~/hooks/useCalendarStoreContext";
import { useLogger } from "~/utils/logger";
import { isAdminOfTheClub, startDateIsFuture } from "~/utils/utils";
import {
  type RecurrentReservationInputSchema,
  type ReservationInputSchema,
} from "./Calendar";
import DialogFieldGrid from "./DialogFieldGrid";
import DialogLayout from "./DialogLayout";
import ReserveDialogEndDate from "./ReserveDialogEndDate";
import ReserveDialogLoginButton from "./ReserveDialogLoginButton";
import ReserveDialogRecurrent from "./ReserveDialogRecurrent";
dayjs.extend(utc);

export default function ReserveDialog() {
  const { data: sessionData } = useSession();

  const startDate = useCalendarStoreContext((store) => store.getStartDate());

  const clubData = useCalendarStoreContext((store) => store.getClubData());
  const reservationAdd = useCalendarStoreContext((store) =>
    store.getReservationAdd(),
  );
  const recurrentReservationAdd = useCalendarStoreContext((store) =>
    store.getRecurrentReservationAdd(),
  );

  const dateClick = useCalendarStoreContext((state) => state.dateClick);
  const setDateClick = useCalendarStoreContext((state) => state.setDateClick);
  const endDate = useCalendarStoreContext((store) => store.endDate);
  const setEndDate = useCalendarStoreContext((store) => store.setEndDate);
  const endDateError = useCalendarStoreContext((store) => store.endDateError);
  const recurrentEndDate = useCalendarStoreContext(
    (state) => state.recurrentEndDate,
  );
  const setRecurrentEndDate = useCalendarStoreContext(
    (state) => state.setRecurrentEndDate,
  );
  const recurrentEndDateError = useCalendarStoreContext(
    (state) => state.recurringEndDateError,
  );

  const [overwriteName, setOverwriteName] = useState<string | undefined>(
    undefined,
  );
  const resource = dateClick?.resource;
  const logger = useLogger({ component: "ReserveDialog" });

  const onConfirmButton = () => {
    if (!endDate || !startDate || !resource) {
      logger.error(
        {
          endDate: endDate?.toDate(),
          startDate: startDate?.toDate(),
          resource: resource,
        },
        "onConfirmButton: unexpected null value",
      );
      throw new Error("Si è verificato un problema, per favore riprova.");
    }

    const dataPayload: z.infer<typeof ReservationInputSchema> = {
      startDateTime: startDate.toDate(),
      endDateTime: endDate.toDate(),
      overwriteName: overwriteName, //manage undefined of input for controlled component
      clubId: clubData.id,
      courtId: resource.id,
    };

    // recurrent reservation add. Need to convert dates to UTC for better handling in backend
    if (recurrentEndDate) {
      const recurrentEndDateUtc = dayjs
        .utc()
        .year(recurrentEndDate.year())
        .month(recurrentEndDate.month())
        .date(recurrentEndDate.date())
        .startOf("day");
      const recurrentDataPayload: z.infer<
        typeof RecurrentReservationInputSchema
      > = {
        ...dataPayload,
        recurrentStartDate: startDate.utc().startOf("day").toDate(),
        recurrentEndDate: recurrentEndDateUtc.toDate(),
      };
      logger.info(recurrentDataPayload, "recurrent reservation added");
      recurrentReservationAdd.mutate(recurrentDataPayload);
    } else {
      // single reservation add
      logger.info(dataPayload, "reservation added");
      reservationAdd.mutate(dataPayload);
    }
    setDateClick(null);
    setOverwriteName(undefined);
    setEndDate(null);
    setRecurrentEndDate(null);
  };

  return (
    <>
      <Dialog
        data-test="reserve-dialog"
        open={dateClick !== null}
        onClose={() => {
          setDateClick(null);
          setOverwriteName(undefined);
          setEndDate(null);
          setRecurrentEndDate(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogLayout title="Prenota">
          {/* if not login only show "Login" button with no other fields */}
          {sessionData ? (
            <>
              {/* Static data displayed with grid style for column allignement */}
              <DialogFieldGrid
                labelValues={[
                  { label: "Campo", value: resource?.title },
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
                onClick={onConfirmButton}
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
        </DialogLayout>
      </Dialog>
    </>
  );
}
