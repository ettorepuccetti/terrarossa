import { Box, Container, Grid, Typography } from "@mui/material";

const CircoliRoadmap = () => (
  <Box sx={{ bgcolor: "#fff", py: 8 }}>
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Innovazione continua
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            2026: Nuove funzionalità in arrivo
          </Typography>
          <Typography variant="body2" mb={3}>
            Analytics avanzati, pagamenti integrati, app mobile e molto altro.
          </Typography>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Roadmap pubblica
          </Typography>
          <Typography variant="body2" mb={3}>
            I nostri clienti possono suggerire e votare le prossime feature!
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Sicurezza & affidabilità
          </Typography>
          <Typography variant="body2" mb={3}>
            Backup giornalieri, GDPR compliance, uptime 99.99% e supporto 24/7.
          </Typography>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Team di supporto dedicato
          </Typography>
          <Typography variant="body2" mb={3}>
            Rispondiamo in meno di 1h, anche nei weekend.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default CircoliRoadmap;
