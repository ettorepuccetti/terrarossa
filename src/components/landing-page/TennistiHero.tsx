import { Box, Button, Container, Typography, useTheme } from "@mui/material";

const TennistiHero = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        py: 10,
        textAlign: "center",
        overflow: "hidden",
        bgcolor: theme.palette.primary.main,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(120deg, rgba(44,62,80,0.92) 60%, #e65100 100%)",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h1"
          fontWeight={900}
          gutterBottom
          sx={{
            fontSize: { xs: 32, md: 48 },
            letterSpacing: -1,
            color: "#fff",
          }}
        >
          Prenota il tuo campo in pochi click
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 4, opacity: 0.97, fontWeight: 500, color: "#fff" }}
        >
          Trova un campo libero vicino a te o prenota nel tuo circolo preferito
          in modo semplice e veloce.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              color: theme.palette.primary.main,
              px: 3,
              py: 1,
              borderRadius: 99,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: 2,
              display: "inline-block",
            }}
          >
            +10.000 tennisti attivi
          </Box>
          <Box
            sx={{
              bgcolor: "#fff",
              color: theme.palette.primary.main,
              px: 3,
              py: 1,
              borderRadius: 99,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: 2,
              display: "inline-block",
            }}
          >
            +500 circoli disponibili
          </Box>
          <Box
            sx={{
              bgcolor: "#fff",
              color: theme.palette.primary.main,
              px: 3,
              py: 1,
              borderRadius: 99,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: 2,
              display: "inline-block",
            }}
          >
            +50.000 prenotazioni/mese
          </Box>
        </Box>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          href="/search"
          sx={{ fontWeight: 700, px: 5, py: 2, fontSize: 20, boxShadow: 4 }}
        >
          Inizia subito a prenotare
        </Button>
      </Container>
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          bgcolor: "#FFD700",
          color: theme.palette.primary.main,
          px: 3,
          py: 1,
          borderRadius: 99,
          fontWeight: 700,
          fontSize: 16,
          boxShadow: 2,
          display: { xs: "none", md: "inline-block" },
          zIndex: 3,
        }}
      >
        Nuova versione 2026
      </Box>
    </Box>
  );
};

export default TennistiHero;
