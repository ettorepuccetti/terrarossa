import { Avatar, Box, Skeleton, TextField, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { type GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import dayjs from "dayjs";
import { signIn, useSession } from "next-auth/react";
import DeleteAccount from "~/components/DeleteAccount";
import ReservationHeader from "~/components/ReservationHeader";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const Prenota = () => {

  // make sure the user is authenticated, otherwise redirect to login page
  const { data: authData, status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn("auth0");
    }
  })

  const userQuery = api.user.getInfo.useQuery();
  const myReservationsQuery = api.reservation.getMine.useQuery();


  const rows: GridRowsProp | undefined = myReservationsQuery.data?.map((reservation, index) => {
    return {
      id: index,
      col1: dayjs(reservation.startTime).format("DD/MM/YYYY"),
      col2: dayjs(reservation.startTime).format("HH:mm"),
      col3: dayjs(reservation.endTime).format("HH:mm"),
      col4: reservation.court.name,
      col5: reservation.startTime,
    }
  })

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Giorno', sortable: false, flex: 1, minWidth: 105 },
    { field: 'col2', headerName: 'Ora inizio', sortable: false, flex: 1, minWidth: 85 },
    { field: 'col3', headerName: 'Ora fine', sortable: false, flex: 1, minWidth: 85 },
    { field: 'col4', headerName: 'Campo', sortable: false, flex: 1, minWidth: 100, maxWidth: 120 },
    { field: 'col5', headerName: 'FullDate', sortable: false, flex: 1, minWidth: 100 },
  ];

  const initialState: GridInitialStateCommunity = {
    columns: {
      columnVisibilityModel: {
        col5: false,
      }
    },
    sorting: {
      sortModel: [{ field: 'col5', sort: 'desc' }]
    }
  };

  
  if (status === "loading" || userQuery.isLoading) {
    return <Spinner isLoading={true} />
  }

  if (userQuery.isError || myReservationsQuery.isError) {
    return "errore";
  }

  return (
    <>
      <ReservationHeader />
      <Box padding={5} display={"flex"} alignItems={"center"} justifyContent={'center'} flexDirection={"column"} gap={4}>

        <Typography variant={"h6"}>Il mio profilo</Typography>


        {authData?.user.image &&
          <Avatar src={authData?.user.image} sx={{ width: 70, height: 70 }} />
        }
        <TextField
          variant="standard"
          label="nome e cognome"
          defaultValue={authData?.user.name}
          inputProps={{ readOnly: true }}
          sx={{ maxWidth: 300 }}
          fullWidth
        />
        <TextField
          variant="standard"
          label="mail"
          defaultValue={authData?.user.email}
          inputProps={{ readOnly: true }}
          sx={{ maxWidth: 300 }}
          fullWidth
        />


        <TextField
          variant="standard"
          label="iscritto dal"
          defaultValue={dayjs(userQuery.data.createdAt).format("DD/MM/YYYY")}
          inputProps={{ readOnly: true }}
          sx={{ maxWidth: 300 }}
          fullWidth
        />


        <Typography variant={"h6"}>Le mie prenotazioni</Typography>

        {myReservationsQuery.isLoading ?
          <Skeleton variant="rectangular" width={"100%"} height={400} />
          :
          <Box width={"100%"} height={500} maxWidth={700}>
            <DataGrid
              rows={rows ? rows : []}
              columns={columns}
              autoPageSize={true}
              initialState={initialState}
              disableColumnMenu
            />
          </Box>
        }
        <DeleteAccount />
      </Box>
    </>
  )
}

export default Prenota;