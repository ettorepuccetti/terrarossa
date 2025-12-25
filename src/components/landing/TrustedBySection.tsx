import { Box, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { luxuryColors } from "./EnterpriseHero";

const TrustedBySection = () => {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: luxuryColors.cream,
        borderTop: "1px solid",
        borderColor: luxuryColors.lightGray,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: luxuryColors.warmGray,
            mb: 5,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
        >
          La tradizione incontra l&apos;innovazione
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 6, md: 10 },
            flexWrap: "wrap",
          }}
        >
          {[
            "Roland Garros",
            "Wimbledon",
            "Foro Italico",
            "Monte-Carlo",
            "Australian Open",
          ].map((club) => (
            <Typography
              key={club}
              sx={{
                color: alpha(luxuryColors.darkText, 0.3),
                fontWeight: 300,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                letterSpacing: "0.1em",
                fontFamily:
                  "'Playfair Display', Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: luxuryColors.terracotta,
                },
              }}
            >
              {club}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TrustedBySection;
