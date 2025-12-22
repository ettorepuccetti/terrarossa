import { Box, Container, Grid, Typography } from "@mui/material";

const CircoliHowItWorks = () => (
  <Box sx={{ bgcolor: "#fff", py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Come funziona Terrarossa?
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/icons/rocket.svg" alt="Onboarding" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Onboarding guidato
            </Typography>
            <Typography variant="body2">
              Attiva il tuo club in meno di 24h con il supporto del nostro team.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/icons/automation.svg" alt="Automazione" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Automazione completa
            </Typography>
            <Typography variant="body2">
              Gestione prenotazioni, utenti, pagamenti e comunicazioni tutto in
              automatico.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/icons/growth.svg" alt="Crescita" height={48} />
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Crescita garantita
            </Typography>
            <Typography variant="body2">
              Più visibilità, più clienti, più prenotazioni grazie al nostro
              network nazionale.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default CircoliHowItWorks;
