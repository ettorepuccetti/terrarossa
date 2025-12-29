import { Box, Container, Grid, Typography } from "@mui/material";
import { luxuryColors } from "./EnterpriseHero";

const steps = [
  {
    number: "I",
    title: "Registrazione del Circolo",
    description:
      "Il vostro club viene configurato con cura, definendo campi, orari e preferenze di prenotazione.",
  },
  {
    number: "II",
    title: "Invito ai Soci",
    description:
      "I membri del circolo ricevono l'accesso esclusivo alla piattaforma di prenotazione.",
  },
  {
    number: "III",
    title: "Prenotazione Elegante",
    description:
      "I soci selezionano il campo e l'orario desiderato con pochi click raffinati.",
  },
  {
    number: "IV",
    title: "Gestione Serena",
    description:
      "Il circolo monitora prenotazioni e disponibilità in tempo reale, senza alcuno sforzo.",
  },
];

const HowItWorksSection = () => {
  return (
    <Box
      sx={{
        py: 16,
        bgcolor: luxuryColors.warmWhite,
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <Typography
            variant="overline"
            sx={{
              color: luxuryColors.terracotta,
              fontWeight: 500,
              letterSpacing: "0.25em",
              mb: 2,
              display: "block",
              fontSize: "0.7rem",
            }}
          >
            IL PERCORSO
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 300,
              color: luxuryColors.darkText,
              mb: 3,
              letterSpacing: "-0.01em",
              fontFamily:
                "'Playfair Display', Georgia, 'Times New Roman', serif",
            }}
          >
            Un&apos;esperienza{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: luxuryColors.terracotta }}
            >
              senza tempo.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: luxuryColors.warmGray,
              maxWidth: 500,
              mx: "auto",
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}
          >
            Dalla registrazione alla prima prenotazione, ogni passaggio è stato
            progettato per essere naturale e intuitivo.
          </Typography>
        </Box>

        {/* Steps */}
        <Grid container spacing={6}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={step.number}>
              <Box
                sx={{
                  position: "relative",
                  textAlign: "center",
                }}
              >
                {/* Step number */}
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: 300,
                    color: luxuryColors.terracotta,
                    mb: 3,
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  {step.number}
                </Typography>

                {/* Content */}
                <Typography
                  variant="h6"
                  sx={{
                    color: luxuryColors.darkText,
                    fontWeight: 500,
                    mb: 1.5,
                    fontSize: "1.05rem",
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    color: luxuryColors.warmGray,
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
