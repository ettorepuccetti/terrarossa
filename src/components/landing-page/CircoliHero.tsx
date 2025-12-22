import { Box, Button, Container, Typography, useTheme } from "@mui/material";

const CircoliHero = () => {
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
            "linear-gradient(120deg, rgba(44,62,80,0.92) 30%, #e65100 100%)",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h1"
          fontWeight={900}
          gutterBottom
          sx={{
            fontSize: { xs: 36, md: 54 },
            letterSpacing: -1,
            color: "#fff",
          }}
        >
          La piattaforma n.1 per i circoli di tennis
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 4, opacity: 0.97, fontWeight: 500, color: "#fff" }}
        >
          Gestisci, promuovi e fai crescere il tuo club con la tecnologia scelta
          da{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: 800 }}>
            +10.000 tennisti
          </Box>{" "}
          e{" "}
          <Box component="span" sx={{ color: "#FFD700", fontWeight: 800 }}>
            500+ circoli
          </Box>{" "}
          in tutta Italia.
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
            +500 circoli attivi
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
            +10.000 utenti registrati
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
          href="/contatti"
          sx={{ fontWeight: 700, px: 5, py: 2, fontSize: 20, boxShadow: 4 }}
        >
          Richiedi una demo gratuita
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

export default CircoliHero;
