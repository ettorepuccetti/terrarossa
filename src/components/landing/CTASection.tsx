import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { luxuryColors } from "./EnterpriseHero";

const CTASection = () => {
  return (
    <Box
      sx={{
        py: 16,
        position: "relative",
        overflow: "hidden",
        bgcolor: luxuryColors.terracotta,
      }}
    >
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {/* Main heading */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", md: "2.75rem" },
            fontWeight: 300,
            color: luxuryColors.warmWhite,
            mb: 3,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          }}
        >
          Elevate l&apos;esperienza
          <br />
          <Box
            component="span"
            sx={{
              fontStyle: "italic",
            }}
          >
            del vostro circolo.
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: alpha(luxuryColors.warmWhite, 0.85),
            fontSize: { xs: "1rem", md: "1.1rem" },
            maxWidth: 520,
            mx: "auto",
            mb: 6,
            lineHeight: 1.8,
          }}
        >
          Unitevi ai circoli che hanno scelto di offrire ai propri soci
          un&apos;esperienza di prenotazione all&apos;altezza della loro
          tradizione.
        </Typography>

        {/* CTA Button */}
        <Button
          component={Link}
          href="/search"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 5,
            py: 1.75,
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: "2px",
            bgcolor: luxuryColors.warmWhite,
            color: luxuryColors.terracotta,
            textTransform: "none",
            letterSpacing: "0.05em",
            boxShadow: "none",
            "&:hover": {
              bgcolor: luxuryColors.cream,
              boxShadow: `0 8px 24px ${alpha(luxuryColors.terracottaDark, 0.3)}`,
            },
            transition: "all 0.3s ease",
          }}
        >
          Scopri i Circoli
        </Button>
      </Container>
    </Box>
  );
};

export default CTASection;
