import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { luxuryColors } from "./EnterpriseHero";

const testimonials = [
  {
    quote:
      "Da quando il nostro circolo utilizza Terrarossa, la gestione delle prenotazioni è diventata un piacere. I nostri soci apprezzano l'eleganza e la semplicità.",
    author: "Avv. Marco Ferretti",
    role: "Presidente",
    club: "Circolo Tennis Parioli",
    initials: "MF",
  },
  {
    quote:
      "Una soluzione che rispecchia perfettamente lo spirito del nostro club. Discreta, efficiente, raffinata.",
    author: "Dott.ssa Elena Visconti",
    role: "Direttrice Sportiva",
    club: "Tennis Club Milano",
    initials: "EV",
  },
  {
    quote:
      "Finalmente un sistema di prenotazione all'altezza delle aspettative dei nostri membri più esigenti.",
    author: "Ing. Roberto Castellani",
    role: "Amministratore",
    club: "Country Club Firenze",
    initials: "RC",
  },
];

const TestimonialsSection = () => {
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
            TESTIMONIANZE
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
            Parole di{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: luxuryColors.terracotta }}
            >
              apprezzamento.
            </Box>
          </Typography>
        </Box>

        {/* Testimonials grid */}
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.author}>
              <Box
                sx={{
                  p: 5,
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: luxuryColors.lightGray,
                  bgcolor: luxuryColors.warmWhite,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    boxShadow: `0 8px 32px ${alpha(luxuryColors.terracotta, 0.08)}`,
                  },
                }}
              >
                {/* Quote icon */}
                <FormatQuoteIcon
                  sx={{
                    fontSize: 32,
                    color: luxuryColors.terracotta,
                    opacity: 0.4,
                    mb: 3,
                  }}
                />

                {/* Quote text */}
                <Typography
                  sx={{
                    color: luxuryColors.darkText,
                    fontSize: "1rem",
                    lineHeight: 1.9,
                    fontStyle: "italic",
                    flex: 1,
                    mb: 4,
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
                      bgcolor: luxuryColors.terracotta,
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      fontFamily:
                        "'Playfair Display', Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {testimonial.initials}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: luxuryColors.darkText,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                    >
                      {testimonial.author}
                    </Typography>
                    <Typography
                      sx={{
                        color: luxuryColors.warmGray,
                        fontSize: "0.8rem",
                      }}
                    >
                      {testimonial.role} · {testimonial.club}
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
