import { Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import dayjs from "dayjs";
import { type RouterOutputs } from "~/utils/api";

export const ProfileReservationsGrid = ({
  reservations,
}: {
  reservations: RouterOutputs["reservationQuery"]["getMine"];
}) => {
  const rows: GridRowsProp | undefined = reservations.map(
    (reservation, index) => {
      return {
        id: index,
        col1: dayjs(reservation.startTime).format("DD/MM/YYYY"),
        col2: dayjs(reservation.startTime).format("HH:mm"),
        col3: dayjs(reservation.endTime).format("HH:mm"),
        col4: reservation.court.name,
        col5: reservation.startTime,
        col6: reservation.court.Club.name,
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
      // hidden column to sort by date
      field: "col5",
      headerName: "FullDate",
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "col6",
      headerName: "Club",
      sortable: false,
      flex: 1,
      minWidth: 120,
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

  return (
    <Box width={"100%"} height={500} maxWidth={700}>
      <DataGrid
        data-test="profile-reservations-grid"
        rows={rows ?? []}
        columns={columns}
        autoPageSize={true}
        initialState={initialState}
        disableColumnMenu
      />
    </Box>
  );
};
