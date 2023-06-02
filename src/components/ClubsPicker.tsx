import { api } from "~/utils/api";
import ErrorAlert from "./ErrorAlert";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import Link from "next/link";

export default function ClubsPicker() {
  const clubQuery = api.club.getAll.useQuery();

  if (clubQuery.isError) {
    return (
      <ErrorAlert
        onClose={() => {
          void clubQuery.refetch();
        }}
        error={clubQuery.error}
      />
    );
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      alignItems={"center"}
    >
      <Typography variant="h6" sx={{ opacity: 0.4 }}>
        Scegli il tuo Circolo:
      </Typography>
      {clubQuery.isLoading ? (
        <Skeleton
          variant="rectangular"
          width={250}
          height={200}
          animation="wave"
        />
      ) : (
        clubQuery.data.map((club, index) => {
          return (
            <Link
              key={index}
              href={{
                pathname: "prenota",
                query: { clubId: club.id },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "200px", fontSize: "16px" }}
              >
                {club.name}
              </Button>
            </Link>
          );
        })
      )}
    </Box>
  );
}
