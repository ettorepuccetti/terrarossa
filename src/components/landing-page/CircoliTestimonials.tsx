import { Box, Card, Container, Grid, Typography } from "@mui/material";

const CircoliTestimonials = () => (
  <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Cosa dicono i nostri partner
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              “Con Terrarossa abbiamo aumentato le prenotazioni del 40% e
              ridotto i tempi di gestione!”
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Mario, Circolo Tennis Firenze
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              “Finalmente una piattaforma che porta nuovi clienti e semplifica
              tutto!”
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Laura, Club Manager Roma
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              “Il supporto tecnico è rapidissimo e il team sempre disponibile!”
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Andrea, Direttore Club Milano
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default CircoliTestimonials;
