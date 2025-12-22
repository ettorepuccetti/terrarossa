import { Box, Button, Container, Typography, useTheme } from "@mui/material";

const TennistiCTA = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        color: "white",
        py: 2,
        textAlign: "center",
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h6" fontWeight={700} mb={1}>
          Vuoi prenotare subito il tuo campo?
        </Typography>
        <Button
          variant="contained"
          size="medium"
          color="secondary"
          href="/search"
          sx={{ fontWeight: 700, px: 3, py: 1, fontSize: 16 }}
        >
          Inizia ora
        </Button>
      </Container>
    </Box>
  );
};

export default TennistiCTA;
