import { Box, Button, Container, Typography, useTheme } from "@mui/material";

const CircoliStickyCTA = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        color: "white",
        py: 2,
        textAlign: "center",
        // position: "sticky",
        bottom: 0,
        zIndex: 10,
        boxShadow: 8,
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h6" fontWeight={700} mb={1}>
          Vuoi portare il tuo circolo al prossimo livello?
        </Typography>
        <Button
          variant="contained"
          size="medium"
          color="secondary"
          href="/contatti"
          sx={{ fontWeight: 700, px: 3, py: 1, fontSize: 16, boxShadow: 4 }}
        >
          Richiedi una demo gratuita
        </Button>
      </Container>
    </Box>
  );
};

export default CircoliStickyCTA;
