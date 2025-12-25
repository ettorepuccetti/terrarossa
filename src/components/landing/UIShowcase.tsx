import { Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { luxuryColors } from "./EnterpriseHero";

const showcaseItems = [
  {
    title: "Calendario Settimanale",
    description: "Vista completa della disponibilità con selezione intuitiva.",
    screenshot: "/screenshots/user-book.png",
  },
  {
    title: "Dettaglio Prenotazione",
    description: "Conferma elegante con tutti i dettagli a colpo d'occhio.",
    screenshot: "/screenshots/book-modal.png",
  },
  {
    title: "Prenotazione Ricorrente",
    description: "Per i soci abituali, il campo preferito ogni settimana.",
    screenshot: "/screenshots/book-recurrent.png",
  },
  {
    title: "Selezione Orario",
    description: "Scelta fluida dell'orario di fine partita.",
    screenshot: "/screenshots/book-select-end-hour.png",
  },
  {
    title: "Ricerca Circoli",
    description: "Scopri circoli d'eccellenza nella tua zona.",
    screenshot: "/screenshots/club-search.png",
  },
  {
    title: "Area Personale",
    description: "Gestione delle prenotazioni in un profilo curato.",
    screenshot: "/screenshots/my-booking.png",
  },
  {
    title: "Profilo",
    description: "Il tuo profilo utente.",
    screenshot: "/screenshots/profile.png",
  },
];

const UIShowcase = () => {
  return (
    <Box
      sx={{
        py: 16,
        bgcolor: luxuryColors.cream,
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
            L&apos;INTERFACCIA
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
            Design che{" "}
            <Box
              component="span"
              sx={{
                fontStyle: "italic",
                color: luxuryColors.terracotta,
              }}
            >
              ispira fiducia.
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
            Un&apos;esperienza visiva raffinata, progettata per essere
            all&apos;altezza dei circoli più prestigiosi.
          </Typography>
        </Box>

        {/* Showcase grid - bento style */}
        <Grid container spacing={3}>
          {/* First row - 2 large items */}
          <Grid item xs={12} md={6}>
            <ShowcaseCard item={showcaseItems[0]!} height={380} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ShowcaseCard item={showcaseItems[1]!} height={380} />
          </Grid>

          {/* Second row - 3 items */}
          <Grid item xs={12} md={4}>
            <ShowcaseCard item={showcaseItems[2]!} height={320} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ShowcaseCard item={showcaseItems[3]!} height={320} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ShowcaseCard item={showcaseItems[4]!} height={320} />
          </Grid>

          {/* First row - 2 large items */}
          <Grid item xs={12} md={8}>
            <ShowcaseCard item={showcaseItems[5]!} height={380} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ShowcaseCard item={showcaseItems[6]!} height={380} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

interface ShowcaseCardProps {
  item: (typeof showcaseItems)[0];
  height: number;
  wide?: boolean;
}

const ShowcaseCard = ({ item, height, wide }: ShowcaseCardProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        height,
        borderRadius: "8px",
        overflow: "hidden",
        bgcolor: luxuryColors.warmWhite,
        border: "1px solid",
        borderColor: luxuryColors.lightGray,
        transition: "all 0.4s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: `0 16px 48px ${alpha(luxuryColors.terracotta, 0.12)}`,
          "& .showcase-image": {
            transform: "scale(1.02)",
          },
          "& .showcase-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Screenshot */}
      <Box
        className="showcase-image"
        sx={{
          position: "absolute",
          inset: 0,
          transition: "transform 0.6s ease",
        }}
      >
        <Image
          src={item.screenshot}
          alt={item.title}
          fill
          style={{
            objectFit: wide ? "contain" : "cover",
            objectPosition: "top center",
          }}
        />
      </Box>

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 40%, ${alpha(luxuryColors.darkText, 0.85)} 100%)`,
        }}
      />

      {/* Content overlay */}
      <Box
        className="showcase-overlay"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          opacity: 0.9,
          transition: "opacity 0.3s ease",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: luxuryColors.warmWhite,
            fontWeight: 500,
            mb: 0.5,
            fontSize: "1.1rem",
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            color: alpha(luxuryColors.warmWhite, 0.8),
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          {item.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default UIShowcase;
