import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

const CTASection = () => {
  return (
    <Box
      sx={{
        py: 20,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)",
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 80% at 50% 120%, rgba(230, 81, 0, 0.2), transparent),
            radial-gradient(ellipse 60% 60% at 20% 80%, rgba(102, 126, 234, 0.1), transparent),
            radial-gradient(ellipse 60% 60% at 80% 80%, rgba(240, 147, 251, 0.1), transparent)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {/* Main heading */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.5rem", md: "4rem" },
            fontWeight: 800,
            color: "#fff",
            mb: 3,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Pronto a trasformare
          <br />
          <Box
            component="span"
            sx={{
              background:
                "linear-gradient(135deg, #e65100 0%, #ff9800 50%, #ffc107 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            il tuo circolo?
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: alpha("#fff", 0.7),
            fontSize: { xs: "1rem", md: "1.25rem" },
            maxWidth: 600,
            mx: "auto",
            mb: 6,
            lineHeight: 1.7,
          }}
        >
          Unisciti a centinaia di circoli che hanno già scelto Terrarossa per
          semplificare la gestione delle prenotazioni e far crescere la loro
          community.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 6,
          }}
        >
          <Button
            component={Link}
            href="/search"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 5,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)",
              boxShadow: "0 8px 32px rgba(230, 81, 0, 0.4)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #ff6d00 0%, #ff9800 100%)",
                boxShadow: "0 12px 40px rgba(230, 81, 0, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Inizia Subito — È Gratis
          </Button>
          <Button
            component="a"
            href="mailto:info@terrarossa.it"
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "14px",
              borderColor: alpha("#fff", 0.2),
              borderWidth: 2,
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                borderColor: alpha("#fff", 0.4),
                bgcolor: alpha("#fff", 0.05),
                borderWidth: 2,
              },
            }}
          >
            Contattaci
          </Button>
        </Box>

        {/* Trust badges */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "Setup in 5 minuti",
            "Nessuna carta richiesta",
            "Supporto italiano",
          ].map((badge) => (
            <Box
              key={badge}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: alpha("#00d26a", 0.2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00d26a",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: alpha("#fff", 0.7),
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {badge}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
