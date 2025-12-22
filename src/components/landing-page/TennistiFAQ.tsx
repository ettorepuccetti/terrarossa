import { Box, Container, Grid, Typography } from "@mui/material";

const TennistiFAQ = () => (
  <Box sx={{ bgcolor: "#fff", py: 8 }}>
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Domande frequenti
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Serve registrazione per prenotare?
          </Typography>
          <Typography variant="body2" mb={3}>
            Sì, ma bastano pochi secondi e puoi gestire tutto dal tuo profilo.
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Posso prenotare per più persone?
          </Typography>
          <Typography variant="body2" mb={3}>
            Certo, puoi aggiungere amici e prenotare per loro.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Posso cancellare una prenotazione?
          </Typography>
          <Typography variant="body2" mb={3}>
            Sì, puoi cancellare o modificare le tue prenotazioni in autonomia.
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Quanto costa usare Terrarossa?
          </Typography>
          <Typography variant="body2" mb={3}>
            Per i tennisti il servizio è gratuito!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default TennistiFAQ;
