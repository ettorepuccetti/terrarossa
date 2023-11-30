import { Box, Skeleton } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import dayjs from "dayjs";
import { useMyReservationsQuery } from "~/hooks/profileTrpcHooks";

export const ProfileReservationsGrid = () => {
  const myReservationsQuery = useMyReservationsQuery();

  const rows: GridRowsProp | undefined = myReservationsQuery.data?.map(
    (reservation, index) => {
      return {
        id: index,
        col1: dayjs(reservation.startTime).format("DD/MM/YYYY"),
        col2: dayjs(reservation.startTime).format("HH:mm"),
        col3: dayjs(reservation.endTime).format("HH:mm"),
        col4: reservation.court.name,
        col5: reservation.startTime,
      };
    },
  );

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "Giorno",
      sortable: false,
      flex: 1,
      minWidth: 105,
    },
    {
      field: "col2",
      headerName: "Ora inizio",
      sortable: false,
      flex: 1,
      minWidth: 85,
    },
    {
      field: "col3",
      headerName: "Ora fine",
      sortable: false,
      flex: 1,
      minWidth: 85,
    },
    {
      field: "col4",
      headerName: "Campo",
      sortable: false,
      flex: 1,
      minWidth: 100,
      maxWidth: 120,
    },
    {
      field: "col5",
      headerName: "FullDate",
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
  ];

  const initialState: GridInitialStateCommunity = {
    columns: {
      columnVisibilityModel: {
        col5: false,
      },
    },
    sorting: {
      sortModel: [{ field: "col5", sort: "desc" }],
    },
  };

  if (myReservationsQuery.isError) {
    return null;
  }

  if (myReservationsQuery.isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={400}
        sx={{ maxWidth: "700px" }}
      />
    );
  }

  return (
    <Box width={"100%"} height={500} maxWidth={700}>
      <DataGrid
        rows={rows ? rows : []}
        columns={columns}
        autoPageSize={true}
        initialState={initialState}
        disableColumnMenu
      />
    </Box>
  );
};
