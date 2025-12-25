import { Box, Card, Container, Grid, Typography } from "@mui/material";

const TennistiTestimonials = () => (
  <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Cosa dicono i nostri utenti
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
              “Prenotare un campo non è mai stato così facile e veloce!”
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Luca, appassionato di tennis
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
              &quot;Finalmente posso trovare un campo libero anche
              all&apos;ultimo minuto!&quot;
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Giulia, giocatrice amatoriale
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
              “Ho scoperto nuovi circoli e gioco molto più spesso!”
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} mt={2}>
              Marco, tennista occasionale
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default TennistiTestimonials;
