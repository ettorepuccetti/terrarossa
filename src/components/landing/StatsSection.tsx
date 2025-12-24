import { Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Tennisti Registrati",
    description: "Utenti attivi sulla piattaforma",
  },
  {
    value: 500,
    suffix: "+",
    label: "Circoli Partner",
    description: "Club in tutta Italia",
  },
  {
    value: 50000,
    suffix: "+",
    label: "Prenotazioni al Mese",
    description: "Gestite automaticamente",
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime Garantito",
    description: "Affidabilità enterprise",
  },
];

const StatsSection = () => {
  return (
    <Box
      sx={{
        py: 16,
        bgcolor: "#0f0f0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, ${alpha("#fff", 0.03)} 1px, transparent 0)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow effects */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(230, 81, 0, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: "20%",
          transform: "translate(50%, -50%)",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
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
            I NUMERI CHE CONTANO
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            La community che cresce
          </Typography>
        </Box>

        {/* Stats grid */}
        <Grid container spacing={4}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: "24px",
                  border: "1px solid",
                  borderColor: alpha("#fff", 0.06),
                  bgcolor: alpha("#fff", 0.02),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha("#e65100", 0.3),
                    bgcolor: alpha("#e65100", 0.03),
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2rem", md: "3rem" },
                    background:
                      "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "1rem",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha("#fff", 0.5),
                    fontSize: "0.85rem",
                  }}
                >
                  {stat.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
