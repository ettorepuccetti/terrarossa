import { api } from "~/utils/api";

export const useUserQuery = () => {
  return api.user.getInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useMyReservationsQuery = () => {
  return api.reservationQuery.getMine.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetSignedUrl = () => {
  return api.user.getSignedUrlForUploadImage.useMutation();
};

export const useUpdateImageSrc = () => {
  const userQuery = useUserQuery();
  return api.user.updateImageSrc.useMutation({
    async onSuccess() {
      userQuery.remove();
      await userQuery.refetch();
    },
  });
};
