import { type Dayjs } from "dayjs";
import { z } from "zod";
import { api } from "~/utils/api";
import { useMergedStoreContext } from "./useMergedStoreContext";

//--------------------------------
//-------- INPUT SCHEMAS ---------
//--------------------------------
export const ReservationInputSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  courtId: z.string(),
  overwriteName: z.string().optional(),
  clubId: z.string(),
});

export const RecurrentReservationInputSchema = z
  .object({
    recurrentStartDate: z.date(),
    recurrentEndDate: z.date(),
  })
  .and(ReservationInputSchema);

export const ReservationDeleteInputSchema = z.object({
  reservationId: z.string(),
  clubId: z.string(),
});

export const RecurrentReservationDeleteInputSchema = z.object({
  recurrentReservationId: z.string(),
  clubId: z.string(),
});

export const ClubIdInputSchema = z.object({
  clubId: z.union([z.string(), z.string().array(), z.undefined()]), //router param can also be undefined or array of strings
});

export const reservationQueryInputSchema = z.object({
  clubId: z.string().optional(), //router param can also be undefined or array of strings
  customSelectedDate: z.date().optional(),
});

//------------------------------
//------- QUERIES HOOKS --------
//------------------------------

export const useClubQuery = (clubId: string | undefined) => {
  return api.club.getByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
      staleTime: Infinity,
    },
  );
};

export const useCourtQuery = (clubId: string | undefined) =>
  api.court.getAllByClubId.useQuery(
    { clubId: clubId },
    {
      refetchOnWindowFocus: false,
      enabled: clubId !== undefined,
      staleTime: Infinity,
    },
  );

export const useReservationQuery = (
  clubId: string | undefined,
  selectedDate: Dayjs,
) => {
  const customSelectedDate = useMergedStoreContext(
    (store) => store.customDateSelected,
  );
  return api.reservationQuery.getAllVisibleInCalendarByClubId.useQuery(
    {
      clubId: clubId,
      customSelectedDate: customSelectedDate
        ? selectedDate.toDate()
        : undefined,
    },
    { refetchOnWindowFocus: false, enabled: clubId !== undefined },
  );
};

//-------------------------------
//------- MUTATION HOOKS --------
//-------------------------------

export const useReservationAdd = () => {
  const reservationQuery = useMergedStoreContext(
    (store) => store.reservationQuery,
  );
  return api.reservationMutation.insertOne.useMutation({
    async onSuccess() {
      await reservationQuery?.refetch();
    },
    async onError() {
      await reservationQuery?.refetch();
    },
  });
};

export const useRecurrentReservationAdd = () => {
  const reservationQuery = useMergedStoreContext(
    (store) => store.reservationQuery,
  );
  return api.reservationMutation.insertRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery?.refetch();
    },
    async onError() {
      await reservationQuery?.refetch();
    },
  });
};

export const useReservationDelete = () => {
  const reservationQuery = useMergedStoreContext(
    (store) => store.reservationQuery,
  );
  return api.reservationMutation.deleteOne.useMutation({
    async onSuccess() {
      await reservationQuery?.refetch();
    },
    async onError() {
      await reservationQuery?.refetch();
    },
  });
};

export const useRecurrentReservationDelete = () => {
  const reservationQuery = useMergedStoreContext(
    (store) => store.reservationQuery,
  );
  return api.reservationMutation.deleteRecurrent.useMutation({
    async onSuccess() {
      await reservationQuery?.refetch();
    },
    async onError() {
      await reservationQuery?.refetch();
    },
  });
};
