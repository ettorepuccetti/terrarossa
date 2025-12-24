import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Prodotto: [
    { label: "Funzionalità", href: "#features" },
    { label: "Per i Circoli", href: "#circoli" },
    { label: "Per i Tennisti", href: "#tennisti" },
    { label: "Prezzi", href: "#pricing" },
  ],
  Risorse: [
    { label: "Documentazione", href: "#docs" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "#blog" },
    { label: "Supporto", href: "mailto:support@terrarossa.it" },
  ],
  Azienda: [
    { label: "Chi Siamo", href: "#about" },
    { label: "Contatti", href: "mailto:info@terrarossa.it" },
    { label: "Lavora con Noi", href: "#careers" },
    { label: "Partner", href: "#partners" },
  ],
  Legale: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Termini di Servizio", href: "/terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "GDPR", href: "#gdpr" },
  ],
};

const EnterpriseFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#050505",
        borderTop: "1px solid",
        borderColor: alpha("#fff", 0.06),
        pt: 10,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Main footer content */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Image
                src="/mstile-144x144.png"
                alt="Terrarossa"
                width={40}
                height={40}
                style={{ borderRadius: 8 }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Terrarossa
              </Typography>
            </Box>
            <Typography
              sx={{
                color: alpha("#fff", 0.5),
                mb: 3,
                maxWidth: 280,
                lineHeight: 1.7,
              }}
            >
              La piattaforma all-in-one per la gestione delle prenotazioni dei
              circoli di tennis.
            </Typography>
            {/* Social links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: alpha("#fff", 0.5),
                  "&:hover": { color: "#fff", bgcolor: alpha("#fff", 0.1) },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: alpha("#fff", 0.5),
                  "&:hover": { color: "#fff", bgcolor: alpha("#fff", 0.1) },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: alpha("#fff", 0.5),
                  "&:hover": { color: "#fff", bgcolor: alpha("#fff", 0.1) },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={6} sm={3} md={2} key={category}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  mb: 2,
                  fontSize: "0.9rem",
                }}
              >
                {category}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {links.map((link) => (
                  <Typography
                    key={link.label}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: alpha("#fff", 0.5),
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: alpha("#fff", 0.06), mb: 4 }} />

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: alpha("#fff", 0.4),
              fontSize: "0.8rem",
            }}
          >
            © {new Date().getFullYear()} Terrarossa. Tutti i diritti riservati.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#00d26a",
                boxShadow: "0 0 8px #00d26a",
              }}
            />
            <Typography
              sx={{
                color: alpha("#fff", 0.4),
                fontSize: "0.8rem",
              }}
            >
              Tutti i sistemi operativi
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EnterpriseFooter;
