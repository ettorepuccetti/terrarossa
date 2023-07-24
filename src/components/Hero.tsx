import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import heroSrc from "../../public/images/myteam.jpg";

const Hero = () => {
  return (
    <Box
    display={"flex"}
    alignItems={"center"}
    justifyContent={"center"}
    minHeight={"82vh"} // 100vh - 10vh (header) - 8vh (footer)
    >
      <Grid
        container
        spacing={6}
        display={"flex"}
        alignItems={"center"}
        maxWidth={"lg"}
        padding={"50px"}
        justifyContent={"center"}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} paddingBottom={"15px"}>
            Prenota ora il tuo campo da tennis
          </Typography>
          <Typography variant="h6" paddingBottom={"30px"} sx={{opacity: 0.4}}>
            con Terrarossa
          </Typography>
          <Link href={"/search"}>
            <Button color="secondary" variant="contained">
              Prenota
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Image
            priority
            src={heroSrc}
            alt="My Team"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
