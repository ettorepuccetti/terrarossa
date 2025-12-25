import { Box, Button, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

// Warm, luxurious color palette inspired by tennis heritage
export const luxuryColors = {
  terracotta: "#C45C26",
  terracottaLight: "#D4784A",
  terracottaDark: "#8B3A14",
  cream: "#FAF7F2",
  warmWhite: "#FFFDF9",
  gold: "#B8860B",
  goldLight: "#D4AF37",
  forestGreen: "#1B4332",
  warmGray: "#5C5C5C",
  lightGray: "#E8E4DE",
  darkText: "#2C2C2C",
};

const EnterpriseHero = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${luxuryColors.warmWhite} 0%, ${luxuryColors.cream} 100%)`,
        pt: { xs: 12, md: 0 },
      }}
    >
      {/* Subtle texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C45C26' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />

      {/* Elegant corner accent */}
      <Box
        sx={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${alpha(luxuryColors.terracotta, 0.04)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {/* Elegant badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 1,
            mb: 5,
            borderRadius: "2px",
            border: "1px solid",
            borderColor: alpha(luxuryColors.gold, 0.25),
            bgcolor: alpha(luxuryColors.gold, 0.03),
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: luxuryColors.forestGreen,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: luxuryColors.warmGray,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            Dal 2024 • Circoli Selezionati
          </Typography>
        </Box>

        {/* Main heading with serif elegance */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem", lg: "4.5rem" },
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: luxuryColors.darkText,
            mb: 4,
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          }}
        >
          L&apos;arte della prenotazione,
          <br />
          <Box
            component="span"
            sx={{
              fontStyle: "italic",
              color: luxuryColors.terracotta,
            }}
          >
            elevata.
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1rem", md: "1.15rem" },
            color: luxuryColors.warmGray,
            maxWidth: 640,
            mx: "auto",
            mb: 6,
            fontWeight: 400,
            lineHeight: 1.9,
            letterSpacing: "0.01em",
          }}
        >
          Per circoli che non si accontentano. Una piattaforma raffinata per
          gestire prenotazioni con l&apos;eleganza che i vostri soci meritano.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 10,
          }}
        >
          <Button
            component={Link}
            href="/search"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "0.9rem",
              fontWeight: 500,
              borderRadius: "2px",
              bgcolor: luxuryColors.terracotta,
              color: "#fff",
              textTransform: "none",
              letterSpacing: "0.05em",
              boxShadow: "none",
              "&:hover": {
                bgcolor: luxuryColors.terracottaDark,
                boxShadow: `0 8px 24px ${alpha(luxuryColors.terracotta, 0.2)}`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Richiedi Accesso
          </Button>
          <Button
            component={Link}
            href="/search"
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "0.9rem",
              fontWeight: 500,
              borderRadius: "2px",
              borderColor: luxuryColors.lightGray,
              borderWidth: 1,
              color: luxuryColors.warmGray,
              textTransform: "none",
              letterSpacing: "0.05em",
              "&:hover": {
                borderColor: luxuryColors.terracotta,
                color: luxuryColors.terracotta,
                bgcolor: "transparent",
              },
            }}
          >
            Scopri i Circoli
          </Button>
        </Box>

        {/* Refined stats */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 4, md: 8 },
            justifyContent: "center",
            flexWrap: "wrap",
            pt: 6,
            borderTop: "1px solid",
            borderColor: luxuryColors.lightGray,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          {[
            { value: "500+", label: "Circoli Partner" },
            { value: "10.000+", label: "Soci Attivi" },
            { value: "99.9%", label: "Disponibilità" },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  color: luxuryColors.terracotta,
                  fontFamily:
                    "'Playfair Display', Georgia, 'Times New Roman', serif",
                  mb: 0.5,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: luxuryColors.warmGray,
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default EnterpriseHero;
