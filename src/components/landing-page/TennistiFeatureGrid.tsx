import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import Image from "next/image";

// Simple Screenshot component for backwards compatibility
const Screenshot = ({ alt, src }: { alt: string; src: string }) => (
  <Box sx={{ position: "relative", width: "100%", height: 200 }}>
    <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
  </Box>
);

const TennistiFeatureGrid = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Tutto quello che puoi fare
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Cerca tra i circoli
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Filtra per zona, superficie e orario: trova subito il campo
                perfetto per te.
              </Typography>
              <Screenshot
                alt="Ricerca club"
                src="/screenshots/club-search.png"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Prenota in pochi secondi
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Scegli data e ora, conferma e ricevi subito la conferma della
                prenotazione.
              </Typography>
              <Screenshot
                alt="Gestione prenotazioni"
                src="/screenshots/user-book.png"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Gestisci le tue prenotazioni
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Modifica o cancella le tue prenotazioni direttamente dal tuo
                profilo.
              </Typography>
              <Screenshot
                alt="Prenotazioni profilo"
                src="/screenshots/profile-reservations.png"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TennistiFeatureGrid;
