import { Box, Container, LinearProgress } from "@mui/material";
import { type Club } from "@prisma/client";
import { useState } from "react";
import { useAllClubsQuery } from "~/hooks/searchTrpcHook";
import { ClubSearchCard } from "./ClubSearchCard";
import ErrorAlert from "./ErrorAlert";
import SearchBar from "./SearchBar";

export const Search = () => {
  const allClubsQuery = useAllClubsQuery();

  const [filteredClubs, setFilteredClubs] = useState<Club[] | undefined>();

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
        onClose={() => allClubsQuery.refetch}
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
