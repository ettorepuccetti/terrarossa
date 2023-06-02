import React from "react";
import { Grid, Typography, Button, Box, Skeleton } from "@mui/material";
import styles from "../styles/Hero.module.css";
import Image from "next/image";
import heroSrc from "../../public/images/myteam.jpg";
import Link from "next/link";
import { api } from "~/utils/api";
import ErrorAlert from "./ErrorAlert";

const Hero = () => {
  const clubQuery = api.club.getAll.useQuery();

  if (clubQuery.isError) {
    return <ErrorAlert onClose={() => {void clubQuery.refetch()}} error={clubQuery.error} />;
  }

  return (
    <Box className={styles.heroBox}>
      <Grid
        container
        spacing={6}
        className={styles.gridContainer}
        justifyContent={"center"}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            Prenota ora il tuo campo da tennis
          </Typography>
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
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Image src={heroSrc} alt="My Team" className={styles.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
