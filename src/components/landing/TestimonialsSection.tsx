import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const testimonials = [
  {
    quote:
      "Con Terrarossa abbiamo ridotto del 70% il tempo dedicato alla gestione delle prenotazioni. I nostri soci sono entusiasti della semplicità d'uso.",
    author: "Marco Rossi",
    role: "Direttore Sportivo",
    club: "Tennis Club Roma",
    avatar: "M",
    color: "#667eea",
  },
  {
    quote:
      "Finalmente una piattaforma pensata per i circoli italiani. Il supporto è eccezionale e le funzionalità sono esattamente quelle di cui avevamo bisogno.",
    author: "Laura Bianchi",
    role: "Responsabile Prenotazioni",
    club: "Circolo Tennis Milano",
    avatar: "L",
    color: "#f093fb",
  },
  {
    quote:
      "Da quando usiamo Terrarossa, le prenotazioni sono aumentate del 40%. I nostri clienti adorano poter prenotare 24/7 dal loro smartphone.",
    author: "Giuseppe Verdi",
    role: "Presidente",
    club: "Tennis Academy Napoli",
    avatar: "G",
    color: "#4facfe",
  },
  {
    quote:
      "Prenotare un campo non è mai stato così facile! Trovo subito la disponibilità e ricevo la conferma istantaneamente.",
    author: "Giulia Mancini",
    role: "Tennista Agonista",
    club: "Utente Premium",
    avatar: "G",
    color: "#43e97b",
  },
  {
    quote:
      "Ho scoperto nuovi circoli vicino a casa grazie a Terrarossa. Ora gioco molto più spesso e ho conosciuto tanti altri appassionati.",
    author: "Andrea Ferrari",
    role: "Appassionato di Tennis",
    club: "Utente",
    avatar: "A",
    color: "#e65100",
  },
  {
    quote:
      "La dashboard è fantastica. Vedo tutto in tempo reale: prenotazioni, disponibilità, statistiche. Un game changer per il nostro club.",
    author: "Francesca Romano",
    role: "Club Manager",
    club: "Sporting Club Torino",
    avatar: "F",
    color: "#ff6d00",
  },
];

const TestimonialsSection = () => {
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
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "50%",
          background:
            "radial-gradient(ellipse at center top, rgba(230, 81, 0, 0.05) 0%, transparent 60%)",
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
            TESTIMONIANZE
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
            Cosa dicono di noi
          </Typography>
          <Typography
            sx={{
              color: alpha("#fff", 0.6),
              maxWidth: 500,
              mx: "auto",
              fontSize: "1.1rem",
            }}
          >
            Unisciti a migliaia di tennisti e circoli che hanno scelto
            Terrarossa.
          </Typography>
        </Box>

        {/* Testimonials grid */}
        <Grid container spacing={3}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.author}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: alpha("#fff", 0.06),
                  bgcolor: alpha("#fff", 0.02),
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: alpha(testimonial.color, 0.3),
                    bgcolor: alpha(testimonial.color, 0.03),
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Quote icon */}
                <FormatQuoteIcon
                  sx={{
                    fontSize: 40,
                    color: testimonial.color,
                    opacity: 0.5,
                    mb: 2,
                  }}
                />

                {/* Quote text */}
                <Typography
                  sx={{
                    color: alpha("#fff", 0.85),
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    flex: 1,
                    mb: 3,
                  }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </Typography>

                {/* Author */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: testimonial.color,
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {testimonial.author}
                    </Typography>
                    <Typography
                      sx={{
                        color: alpha("#fff", 0.5),
                        fontSize: "0.85rem",
                      }}
                    >
                      {testimonial.role} • {testimonial.club}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
