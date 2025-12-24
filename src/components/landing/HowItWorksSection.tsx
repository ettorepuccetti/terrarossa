import { Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const steps = [
  {
    number: "01",
    title: "Registra il tuo circolo",
    description:
      "Crea il profilo del tuo club in pochi minuti. Aggiungi campi, orari e personalizza le impostazioni.",
    color: "#667eea",
  },
  {
    number: "02",
    title: "Configura i campi",
    description:
      "Definisci le fasce orarie, i prezzi e le regole di prenotazione per ogni campo da tennis.",
    color: "#f093fb",
  },
  {
    number: "03",
    title: "Invita i tuoi soci",
    description:
      "I tuoi soci si registrano e iniziano a prenotare. Tu hai il controllo totale dalla dashboard.",
    color: "#4facfe",
  },
  {
    number: "04",
    title: "Gestisci tutto online",
    description:
      "Monitora prenotazioni, utenti e statistiche in tempo reale. Zero carta, zero telefonate.",
    color: "#43e97b",
  },
];

const HowItWorksSection = () => {
  return (
    <Box
      id="features"
      sx={{
        py: 16,
        bgcolor: "#0f0f0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          left: -200,
          top: "50%",
          transform: "translateY(-50%)",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(230, 81, 0, 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box sx={{ textAlign: "center", mb: 12 }}>
          <Typography
            variant="overline"
            sx={{
              color: "#e65100",
              fontWeight: 700,
              letterSpacing: "0.2em",
              mb: 2,
              display: "block",
            }}
          >
            COME FUNZIONA
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              color: "#fff",
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Inizia in 4 semplici passi
          </Typography>
          <Typography
            sx={{
              color: alpha("#fff", 0.6),
              maxWidth: 500,
              mx: "auto",
              fontSize: "1.1rem",
            }}
          >
            Dal setup alla prima prenotazione in meno di 10 minuti.
          </Typography>
        </Box>

        {/* Steps */}
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={step.number}>
              <Box
                sx={{
                  position: "relative",
                  p: 4,
                  height: "100%",
                  borderRadius: "24px",
                  border: "1px solid",
                  borderColor: alpha("#fff", 0.06),
                  bgcolor: alpha("#fff", 0.02),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha(step.color, 0.3),
                    bgcolor: alpha(step.color, 0.03),
                    transform: "translateY(-4px)",
                    "& .step-number": {
                      transform: "scale(1.1)",
                      boxShadow: `0 8px 32px ${alpha(step.color, 0.4)}`,
                    },
                  },
                }}
              >
                {/* Step number */}
                <Box
                  className="step-number"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${step.color} 0%, ${alpha(step.color, 0.7)} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 20px ${alpha(step.color, 0.3)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>

                {/* Content */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    color: alpha("#fff", 0.6),
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {step.description}
                </Typography>

                {/* Connector line (except last item) */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: 52,
                      right: -40,
                      width: 80,
                      height: 2,
                      background: `linear-gradient(90deg, ${alpha(step.color, 0.4)}, ${alpha(steps[index + 1]?.color || step.color, 0.4)})`,
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
