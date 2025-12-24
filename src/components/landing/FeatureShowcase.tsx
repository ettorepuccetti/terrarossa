import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import { Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";

const features = [
  {
    icon: CalendarMonthIcon,
    title: "Calendario Intelligente",
    description:
      "Visualizza disponibilità in tempo reale. I tuoi utenti prenotano in pochi click senza bisogno di chiamare.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    screenshot: "/screenshots/user-book.png",
  },
  {
    icon: GroupsIcon,
    title: "Gestione Utenti",
    description:
      "Dashboard completa per gestire prenotazioni, utenti e permessi. Tutto sotto controllo in un'unica piattaforma.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    screenshot: "/screenshots/club-search.png",
  },
  {
    icon: SearchIcon,
    title: "Scopri Nuovi Circoli",
    description:
      "I tennisti trovano il tuo circolo sulla piattaforma. Aumenta la visibilità e attira nuovi clienti.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    screenshot: "/screenshots/club-search.png",
  },
  {
    icon: SpeedIcon,
    title: "Prenotazioni Veloci",
    description:
      "Zero burocrazia. I tuoi clienti prenotano 24/7 e tu risparmi tempo prezioso per far crescere il club.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    screenshot: "/screenshots/user-book.png",
  },
];

const FeatureShowcase = () => {
  return (
    <Box
      sx={{
        py: 16,
        bgcolor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 30% 50%, rgba(230, 81, 0, 0.05) 0%, transparent 50%)",
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
            FUNZIONALITÀ
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
            Tutto quello che ti serve,
            <br />
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #e65100 0%, #ff9800 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              pronto all&apos;uso.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: alpha("#fff", 0.6),
              maxWidth: 600,
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.7,
            }}
          >
            Strumenti potenti e intuitivi per gestire il tuo circolo e far
            crescere la community di tennisti.
          </Typography>
        </Box>

        {/* Feature grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <Box
                sx={{
                  position: "relative",
                  p: 4,
                  borderRadius: "24px",
                  border: "1px solid",
                  borderColor: alpha("#fff", 0.08),
                  bgcolor: alpha("#fff", 0.02),
                  backdropFilter: "blur(20px)",
                  height: "100%",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: alpha("#fff", 0.15),
                    bgcolor: alpha("#fff", 0.04),
                    transform: "translateY(-4px)",
                    "& .feature-icon": {
                      transform: "scale(1.1)",
                    },
                    "& .feature-screenshot": {
                      opacity: 1,
                      transform: "translateY(0) rotate(-2deg)",
                    },
                  },
                }}
              >
                {/* Icon */}
                <Box
                  className="feature-icon"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    background: feature.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: `0 8px 32px ${alpha(feature.gradient.split(" ")[1] || "#e65100", 0.3)}`,
                    transition: "transform 0.3s ease",
                  }}
                >
                  <feature.icon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 1.5,
                    fontSize: "1.25rem",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: alpha("#fff", 0.6),
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  {feature.description}
                </Typography>

                {/* Screenshot preview */}
                <Box
                  className="feature-screenshot"
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    opacity: 0.8,
                    transform: "translateY(10px) rotate(-1deg)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Image
                    src={feature.screenshot}
                    alt={feature.title}
                    width={500}
                    height={280}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                  {/* Overlay gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(180deg, transparent 50%, ${alpha("#0a0a0a", 0.8)} 100%)`,
                    }}
                  />
                </Box>

                {/* Background glow */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: feature.gradient,
                    borderRadius: "50%",
                    opacity: 0.03,
                    filter: "blur(80px)",
                    pointerEvents: "none",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureShowcase;
