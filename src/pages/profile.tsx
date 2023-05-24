import { Avatar, Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import ReservationHeader from "~/components/ReservationHeader";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const Prenota = () => {

  // make sure the user is authenticated, otherwise redirect to login page
  const { data: authData, status } = useSession({
    required: true
  })

  const userQuery = api.user.getInfo.useQuery();

  if (status === "loading") {
    return <Spinner isLoading={true} />
  }

  if (!userQuery.isLoading) {
    <Spinner isLoading={true} />
  }

  if (!userQuery.data) {
    return "error";
  }

  return (
    <>
      <ReservationHeader />
      <Box mt={2} display={"flex"} gap={1} justifyContent={'center'} alignItems={"center"}>
        {authData?.user.image &&
          <Avatar src={authData?.user.image} sx={{ width: 50, height: 50 }} />}
        <Typography variant="h5">{authData?.user.name}</Typography>
      </Box>

      <Box>
        {userQuery.data.id}
      </Box>



    </>
  )
}

export default Prenota;