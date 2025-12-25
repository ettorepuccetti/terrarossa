import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";

// Simple Screenshot component for backwards compatibility
const Screenshot = ({ alt, src }: { alt: string; src: string }) => (
  <Box sx={{ position: "relative", width: "100%", height: 200 }}>
    <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
  </Box>
);

const CircoliFeatureGrid = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={800} textAlign="center" mb={6}>
        Cosa puoi fare con Terrarossa
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
                Gestione utenti e prenotazioni
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Visualizza, modifica e controlla tutte le prenotazioni e gli
                utenti del tuo circolo in tempo reale.
              </Typography>
              <Screenshot
                alt="Gestione prenotazioni"
                src="/screenshots/admin-calendar.png"
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
                Nuovi clienti e fidelizzazione
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Porta nuovi tennisti nel tuo club e fidelizza i clienti
                esistenti grazie a notifiche, promozioni e semplicità
                d&apos;uso.
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
                Più prenotazioni, meno burocrazia
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Automatizza la gestione, riduci errori e libera tempo prezioso
                per far crescere la tua community.
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

export default CircoliFeatureGrid;
