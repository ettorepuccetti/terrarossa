import { Box, Container, LinearProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAllClubsQuery } from "~/hooks/searchTrpcHook";
import { type RouterOutputs } from "~/utils/api";
import { UserRoles } from "~/utils/constants";
import { ClubSearchCard } from "./ClubSearchCard";
import ErrorAlert from "./ErrorAlert";
import SearchBar from "./SearchBar";

export type ClubQueryResult = RouterOutputs["club"]["getAll"][number];

export const Search = () => {
  // directly redirect user to club page if is an admin
  const router = useRouter();
  const { data: sessionData } = useSession();
  if (sessionData?.user.role === UserRoles.ADMIN) {
    router.push(`/prenota?clubId=${sessionData?.user.clubId}`);
  }

  const allClubsQuery = useAllClubsQuery();
  const [filteredClubs, setFilteredClubs] = useState<
    ClubQueryResult[] | undefined
  >();

  const onSearch = (term: string) => {
    setFilteredClubs(
      allClubsQuery.data?.filter((club) => {
        return club.name.toLowerCase().includes(term.toLowerCase());
      }),
    );
  };

  if (allClubsQuery.isError) {
    return (
      <ErrorAlert
        onClose={() => void allClubsQuery.refetch()}
        error={allClubsQuery.error}
      />
    );
  }

  if (allClubsQuery.isLoading) {
    return <LinearProgress variant="query" data-test="search-page-loading" />;
  }

  return (
    <Container maxWidth={"sm"} sx={{ mt: 3 }}>
      <SearchBar onSearch={onSearch} />

      <Box
        className="filtered-clubs-result-box"
        display={"flex"}
        flexDirection={"column"}
        gap={1.5}
        mt={3}
      >
        {filteredClubs?.map((club, index) => {
          return <ClubSearchCard key={index} club={club} />;
        })}
      </Box>
    </Container>
  );
};
