import { Box, Container, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";

const clubs = [
  { name: "Foro Italico", logo: "/mstile-144x144.png" },
  { name: "All England Club", logo: "/mstile-144x144.png" },
  { name: "Roland Garros", logo: "/mstile-144x144.png" },
  { name: "Melbourne Park", logo: "/mstile-144x144.png" },
  { name: "US Open", logo: "/mstile-144x144.png" },
];

const TrustedBySection = () => {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "#0a0a0a",
        borderTop: "1px solid",
        borderColor: alpha("#fff", 0.06),
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: alpha("#fff", 0.4),
            mb: 6,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
          }}
        >
          Scelto dai migliori circoli in Italia
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            flexWrap: "wrap",
            opacity: 0.6,
            filter: "grayscale(100%)",
            transition: "all 0.3s ease",
            "&:hover": {
              opacity: 0.8,
              filter: "grayscale(50%)",
            },
          }}
        >
          {clubs.map((club) => (
            <Box
              key={club.name}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  filter: "grayscale(0%)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Image
                src={club.logo}
                alt={club.name}
                width={32}
                height={32}
                style={{ borderRadius: "8px" }}
              />
              <Typography
                sx={{
                  color: alpha("#fff", 0.7),
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {club.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TrustedBySection;
