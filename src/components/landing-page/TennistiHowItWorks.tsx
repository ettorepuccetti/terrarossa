import { Box, Container, Grid, Typography } from "@mui/material";

const TennistiHowItWorks = () => (
  <Box sx={{ bgcolor: "#fff", py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Come funziona Terrarossa per i tennisti?
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/images/search.png" alt="Cerca" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Cerca e confronta
            </Typography>
            <Typography variant="body2">
              Trova il campo perfetto per te tra centinaia di circoli in tutta
              Italia.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/icons/calendar.svg" alt="Prenota" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Prenota in pochi secondi
            </Typography>
            <Typography variant="body2">
              Scegli data e ora, conferma e ricevi subito la conferma della
              prenotazione.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/icons/profile.svg" alt="Gestisci" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Gestisci le tue prenotazioni
            </Typography>
            <Typography variant="body2">
              Modifica o cancella le tue prenotazioni direttamente dal tuo
              profilo.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default TennistiHowItWorks;
