import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import heroSrc from "../../public/images/myteam.jpg";
import styles from "../styles/Hero.module.css";

const Hero = () => {
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
          <Typography variant="h6" className={styles.subtitle}>
            con Terrarossa
          </Typography>
          <Link href={"/search"}>
            <Button color="secondary" variant="contained">
              Prenota
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Image src={heroSrc} alt="My Team" className={styles.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
