import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import styles from "../styles/Hero.module.css";
import Image from "next/image";
import heroSrc from "../../public/images/myteam.jpg";
import Link from "next/link";

const Hero = () => {
  return (
    <Box className={styles.heroBox}>
      <Grid container spacing={6} className={styles.gridContainer} justifyContent={"center"}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            Prenota ora il tuo campo da tennis
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            Con Terrarossa
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
            <Link
              href={{
                pathname: "prenota",
                query: { clubId: "clic0fssh0000icrjkxsr05a5" },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "200px", fontSize: "16px" }}
              >
                Foro Italico
              </Button>
            </Link>

            <Link
              href={{
                pathname: "prenota",
                query: { clubId: "clid61yqk0008icrjhwompfyv" },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "200px", fontSize: "16px" }}
              >
                All England Club
              </Button>
            </Link>
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
