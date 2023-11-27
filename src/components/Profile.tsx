import { Box, LinearProgress, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import DeleteAccount from "~/components/DeleteAccount";
import { api } from "~/utils/api";
import ErrorAlert from "./ErrorAlert";
import ProfilePicture from "./ProfilePicture";
import { ProfileReservationsGrid } from "./ProfileReservationsGrid";
import { ProfileTextInfo } from "./ProfileTextInfo";

export const useUserQuery = () =>
  api.user.getInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useMyReservationsQuery = () =>
  api.reservationQuery.getMine.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

export const Profile = () => {
  const userQuery = useUserQuery();
  const myReservationsQuery = useMyReservationsQuery();
  // make sure the user is authenticated, otherwise redirect to login page
  const { data: authData, status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn("auth0");
    },
  });

  if (status === "loading" || userQuery.isLoading) {
    return <LinearProgress />;
  }

  if (userQuery.isError || myReservationsQuery.isError) {
    return (
      <ErrorAlert
        error={userQuery.error ?? myReservationsQuery.error}
        onClose={() => {
          userQuery.isError && void userQuery.refetch();
          myReservationsQuery.isError && void myReservationsQuery.refetch();
        }}
      />
    );
  }

  return (
    <>
      <Box
        padding={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        gap={4}
      >
        <Typography variant={"h6"}>Il mio profilo</Typography>

        <ProfilePicture />

        <ProfileTextInfo authData={authData} />

        <Typography variant={"h6"}>Le mie prenotazioni</Typography>

        <ProfileReservationsGrid />
        <DeleteAccount />
      </Box>
    </>
  );
};
