import { Box, Container } from "@mui/material";
import { type Club } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ClubSearchCard } from "~/components/ClubSearchCard";
import ErrorAlert from "~/components/ErrorAlert";
import Header from "~/components/Header";
import SearchBar from "~/components/SearchBar";
import { api } from "~/utils/api";

const Search: NextPage = () => {
  const clubQuery = api.club.getAll.useQuery(undefined, { retry: 0 });
  const [filteredClubs, setFilteredClubs] = useState<Club[] | undefined>();

  useEffect(() => {
    setFilteredClubs(clubQuery.data);
  }, [clubQuery.data]);

  const onSearch = (term: string) => {
    console.log("searched: ", term);
    setFilteredClubs(
      clubQuery.data?.filter((club) => {
        return club.name.toLowerCase().includes(term.toLowerCase());
      })
    );
    console.log("Filtered Clubs: ", filteredClubs);
  };

  if (clubQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (clubQuery.isError) {
    return (
      <ErrorAlert onClose={() => clubQuery.remove} error={clubQuery.error} />
    );
  }

  return (
    <>
      <Head>
        <title>Terrarossa</title>
        <meta name="description" content="" />
      </Head>

      <Header />
      <Container maxWidth={"sm"} sx={{ mt: 3 }}>
        <SearchBar onSearch={onSearch} />

        <Box display={"flex"} flexDirection={"column"} gap={1.5} mt={3}>
          {filteredClubs?.map((club, index) => {
            return <ClubSearchCard key={index} club={club} />;
          })}
        </Box>
      </Container>
    </>
  );
};

export default Search;
