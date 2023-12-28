import { api } from "~/utils/api";

export const useAllClubsQuery = () => {
  return api.club.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });
};
