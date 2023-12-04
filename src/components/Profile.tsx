import { Box, LinearProgress, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  useGetSignedUrl,
  useMyReservationsQuery,
  useUpdateImageSrc,
  useUpdateUsername,
  useUserQuery,
} from "~/hooks/profileTrpcHooks";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import { useLogger } from "~/utils/logger";
import DeleteAccount from "./DeleteAccount";
import ErrorAlert from "./ErrorAlert";
import ProfilePicture from "./ProfilePicture";
import { ProfileReservationsGrid } from "./ProfileReservationsGrid";
import { ProfileTextInfo } from "./ProfileTextInfo";

export const Profile = () => {
  const logger = useLogger({
    component: "Profile",
  });

  // make sure the user is authenticated, otherwise redirect to login page
  useSession({
    required: true,
    onUnauthenticated() {
      void signIn("auth0");
    },
  });

  // --------------------------------
  // ------ QUERY & MUTATIONS -------
  // --------------------------------

  // userQuery - subComponents cannot use this query, they will access data directly from the store.
  // I render subcomponents only when userData is present in the store
  const setUserData = useMergedStoreContext((store) => store.setUserData);
  const userQuery = useUserQuery();
  const userDataInStore = useMergedStoreContext((store) => store.userData);

  // myReservationsQuery - ProfileReservationsGrid get data from this query as props, but it may need to refetch it
  // also, setting the query in the store during first render, leave the query in isLoading state forever
  const setMyReservationsQuery = useMergedStoreContext(
    (store) => store.setMyReservationsQuery,
  );
  const myReservationsQuery = useMyReservationsQuery();

  // getSignedUrl
  const setGetSignedUrl = useMergedStoreContext(
    (store) => store.setGetSignedUrl,
  );
  const getSignedUrl = useGetSignedUrl();

  // updateImageSrc
  const setUpdateImageSrc = useMergedStoreContext(
    (store) => store.setUpdateImageSrc,
  );
  const updateImageSrc = useUpdateImageSrc();

  // updateUsername
  const setUpdateUsername = useMergedStoreContext(
    (store) => store.setUpdateUsername,
  );
  const updateUsername = useUpdateUsername();

  // --------------------
  // ----- EFFECTS ------
  // --------------------

  // set userData in store when data are available
  useEffect(() => {
    if (userQuery.data) {
      setUserData(userQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data]);

  // set mutation hooks in the store during first render
  // then clean userData on component unmount
  useEffect(() => {
    setMyReservationsQuery(myReservationsQuery);
    setGetSignedUrl(getSignedUrl);
    setUpdateImageSrc(updateImageSrc);
    setUpdateUsername(updateUsername);
    return () => {
      setUserData(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------
  // ----- RENDER ------
  // -------------------

  if (userQuery.isError) {
    logger.error({ error: userQuery.error }, "error in userQuery");
    return (
      <ErrorAlert
        error={userQuery.error}
        onClose={() => {
          void userQuery.refetch();
        }}
      />
    );
  }

  if (!userDataInStore) {
    return <LinearProgress data-test="profile-page-initial-loading" />;
  }

  const showLoading =
    myReservationsQuery.isLoading ||
    myReservationsQuery.isRefetching ||
    getSignedUrl.isLoading ||
    updateImageSrc.isLoading ||
    updateUsername.isLoading;

  return (
    <>
      {/* Loading handling, the element must always present to avoid layout shifting */}
      <LinearProgress
        data-test="profile-page-additional-loading"
        variant="query"
        sx={{
          visibility: showLoading ? "visible" : "hidden",
        }}
      />

      {/* Error handling */}
      <ErrorAlert
        error={
          myReservationsQuery.error ||
          getSignedUrl.error ||
          updateImageSrc.error ||
          updateUsername.error
        }
        onClose={() => {
          myReservationsQuery.isError && void myReservationsQuery.refetch();
          getSignedUrl.isError && void getSignedUrl.reset();
          updateImageSrc.isError && void updateImageSrc.reset();
          updateUsername.isError && void updateUsername.reset();
        }}
      />

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
        <ProfileTextInfo />

        <Typography variant={"h6"}>Le mie prenotazioni</Typography>
        <ProfileReservationsGrid
          reservations={myReservationsQuery.data || []}
        />

        <DeleteAccount />
      </Box>
    </>
  );
};
