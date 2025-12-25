import { Box, Container, Grid, Typography } from "@mui/material";
import { luxuryColors } from "./EnterpriseHero";

const stats = [
  {
    value: "30+",
    label: "Circoli Selezionati",
    description: "Presenti sulla piattaforma",
  },
  {
    value: "500+",
    label: "Soci Attivi",
    description: "Che prenotano regolarmente",
  },
  {
    value: "5.000+",
    label: "Prenotazioni",
    description: "Gestite con successo",
  },
  {
    value: "24/7",
    label: "Disponibilità",
    description: "Sempre accessibile",
  },
];

const StatsSection = () => {
  return (
    <Box
      sx={{
        py: 12,
        bgcolor: luxuryColors.cream,
        position: "relative",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: luxuryColors.lightGray,
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Stats grid */}
        <Grid container spacing={4}>
          {stats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "2.25rem", md: "3rem" },
                    color: luxuryColors.terracotta,
                    mb: 1,
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: luxuryColors.darkText,
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    mb: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    color: luxuryColors.warmGray,
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
