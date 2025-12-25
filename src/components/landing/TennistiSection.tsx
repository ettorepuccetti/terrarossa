import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import TodayIcon from "@mui/icons-material/Today";
import { Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { luxuryColors } from "./EnterpriseHero";

const benefits = [
  {
    icon: TodayIcon,
    title: "Prenota in Qualsiasi Momento",
    description:
      "Niente più telefonate. Prenota il tuo campo 24 ore su 24, in pochi secondi, direttamente dal tuo smartphone.",
  },
  {
    icon: ExploreIcon,
    title: "Scopri Nuovi Circoli",
    description:
      "Trova circoli d'eccellenza vicino a te. Amplia i tuoi orizzonti e gioca nei migliori club della tua zona.",
  },
  {
    icon: NotificationsActiveIcon,
    title: "Ricevi Promemoria",
    description:
      "Non perdere mai una partita. Ricevi notifiche per le tue prenotazioni e aggiornamenti dal tuo circolo.",
  },
  {
    icon: PhoneAndroidIcon,
    title: "Gestione Semplificata",
    description:
      "Tutte le tue prenotazioni in un unico posto. Consulta lo storico, modifica o cancella con un tap.",
  },
];

const TennistiSection = () => {
  return (
    <Box
      sx={{
        py: 16,
        bgcolor: luxuryColors.warmWhite,
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="overline"
            sx={{
              color: luxuryColors.terracotta,
              fontWeight: 500,
              letterSpacing: "0.25em",
              mb: 2,
              display: "block",
              fontSize: "0.7rem",
            }}
          >
            PER I TENNISTI
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              fontWeight: 300,
              color: luxuryColors.darkText,
              mb: 3,
              letterSpacing: "-0.01em",
              fontFamily:
                "'Playfair Display', Georgia, 'Times New Roman', serif",
            }}
          >
            Più tempo in campo,{" "}
            <Box
              component="span"
              sx={{
                fontStyle: "italic",
                color: luxuryColors.terracotta,
              }}
            >
              meno attese.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: luxuryColors.warmGray,
              maxWidth: 560,
              mx: "auto",
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}
          >
            L&apos;esperienza di prenotazione che ogni giocatore merita.
            Semplice, immediata, sempre disponibile.
          </Typography>
        </Box>

        {/* Benefits grid */}
        <Grid container spacing={6}>
          {benefits.map((benefit) => (
            <Grid item xs={12} sm={6} md={3} key={benefit.title}>
              <Box
                sx={{
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    "& .benefit-icon": {
                      transform: "scale(1.15)",
                      color: luxuryColors.terracottaDark,
                    },
                  },
                }}
              >
                {/* Icon with circle background */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: alpha(luxuryColors.terracotta, 0.08),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <benefit.icon
                      className="benefit-icon"
                      sx={{
                        fontSize: 40,
                        color: luxuryColors.terracotta,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>

                {/* Content */}
                <Typography
                  variant="h6"
                  sx={{
                    color: luxuryColors.darkText,
                    fontWeight: 500,
                    mb: 1.5,
                    fontSize: "1.05rem",
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  sx={{
                    color: luxuryColors.warmGray,
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TennistiSection;
