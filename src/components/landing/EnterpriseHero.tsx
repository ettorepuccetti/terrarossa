import { Box, Button, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

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
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at center, rgba(230, 81, 0, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {/* Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            mb: 4,
            borderRadius: "999px",
            border: "1px solid",
            borderColor: alpha("#fff", 0.1),
            bgcolor: alpha("#fff", 0.05),
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#00d26a",
              boxShadow: "0 0 10px #00d26a",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: alpha("#fff", 0.8),
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            +500 circoli attivi su Terrarossa
          </Typography>
        </Box>

        {/* Main heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            mb: 3,
            "& span": {
              background:
                "linear-gradient(135deg, #e65100 0%, #ff9800 50%, #ffc107 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          }}
        >
          Gestisci le prenotazioni
          <br />
          <span>con semplicità.</span>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            color: alpha("#fff", 0.7),
            maxWidth: 720,
            mx: "auto",
            mb: 5,
            fontWeight: 400,
            lineHeight: 1.7,
          }}
        >
          La piattaforma all-in-one per circoli di tennis. Prenotazioni
          automatiche, gestione utenti e calendario intelligente per far
          crescere il tuo club.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 8,
          }}
        >
          <Button
            component={Link}
            href="/search"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)",
              boxShadow: "0 4px 20px rgba(230, 81, 0, 0.4)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #ff6d00 0%, #ff9800 100%)",
                boxShadow: "0 6px 30px rgba(230, 81, 0, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Inizia Gratis
          </Button>
          <Button
            component={Link}
            href="/search"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "12px",
              borderColor: alpha("#fff", 0.2),
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                borderColor: alpha("#fff", 0.4),
                bgcolor: alpha("#fff", 0.05),
              },
            }}
          >
            Scopri i Circoli
          </Button>
        </Box>

        {/* Stats badges */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 6 },
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "10K+", label: "Tennisti Attivi" },
            { value: "500+", label: "Circoli Partner" },
            { value: "50K+", label: "Prenotazioni/Mese" },
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  background:
                    "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha("#fff", 0.5),
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Bottom gradient fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: "linear-gradient(to top, #0a0a0a, transparent)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default EnterpriseHero;
