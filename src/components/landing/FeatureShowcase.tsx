import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PersonIcon from "@mui/icons-material/Person";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { Box, Container, Grid, Typography } from "@mui/material";
import { luxuryColors } from "./EnterpriseHero";

const features = [
  {
    icon: CalendarMonthIcon,
    title: "Calendario Elegante",
    description:
      "Una vista settimanale raffinata che permette ai vostri soci di individuare immediatamente la disponibilità desiderata.",
  },
  {
    icon: TouchAppIcon,
    title: "Prenotazione Intuitiva",
    description:
      "Un'esperienza di prenotazione fluida e senza attriti, progettata per soddisfare anche i soci più esigenti.",
  },
  {
    icon: EventRepeatIcon,
    title: "Gestione Ricorrenze",
    description:
      "Per i soci affezionati, la possibilità di riservare il proprio slot settimanale con elegante semplicità.",
  },
  {
    icon: PersonIcon,
    title: "Profilo Personale",
    description:
      "Ogni socio dispone di un profilo curato dove consultare le proprie prenotazioni passate e future.",
  },
];

const FeatureShowcase = () => {
  return (
    <Box
      id="features"
      sx={{
        py: 16,
        bgcolor: luxuryColors.warmWhite,
        position: "relative",
        overflow: "hidden",
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
            L&apos;ESPERIENZA
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
            Ogni dettaglio,{" "}
            <Box
              component="span"
              sx={{
                fontStyle: "italic",
                color: luxuryColors.terracotta,
              }}
            >
              curato.
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
            Un&apos;interfaccia che riflette l&apos;attenzione al dettaglio che
            contraddistingue i circoli d&apos;eccellenza.
          </Typography>
        </Box>

        {/* Feature grid */}
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    "& .feature-icon": {
                      transform: "translateY(-8px)",
                      color: luxuryColors.terracottaDark,
                    },
                  },
                }}
              >
                {/* Icon */}
                <Box
                  className="feature-icon"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  <feature.icon
                    sx={{
                      fontSize: 56,
                      color: luxuryColors.terracotta,
                    }}
                  />
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
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: luxuryColors.warmGray,
                    lineHeight: 1.7,
                    fontSize: "0.9rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureShowcase;
