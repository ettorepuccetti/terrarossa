import { Box, Container, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { luxuryColors } from "./EnterpriseHero";

const footerLinks = [
  { label: "Funzionalità", href: "#features" },
  { label: "Circoli", href: "/search" },
  { label: "Contatti", href: "mailto:info@terrarossa.it" },
  { label: "Privacy", href: "/privacy" },
];

const EnterpriseFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: luxuryColors.cream,
        borderTop: "1px solid",
        borderColor: luxuryColors.lightGray,
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Main footer content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Brand */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Image
                src="/mstile-144x144.png"
                alt="Terrarossa"
                width={36}
                height={36}
                style={{ borderRadius: 4 }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: luxuryColors.darkText,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  fontFamily:
                    "'Playfair Display', Georgia, 'Times New Roman', serif",
                }}
              >
                Terrarossa
              </Typography>
            </Box>
            <Typography
              sx={{
                color: luxuryColors.warmGray,
                fontSize: "0.85rem",
                maxWidth: 280,
                lineHeight: 1.7,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Gestione elegante delle prenotazioni per circoli di tennis
              d&apos;eccellenza.
            </Typography>
          </Box>

          {/* Links */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 3, md: 5 },
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {footerLinks.map((link) => (
              <Typography
                key={link.label}
                component={Link}
                href={link.href}
                sx={{
                  color: luxuryColors.warmGray,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: luxuryColors.terracotta,
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: luxuryColors.lightGray, mb: 4 }} />

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: luxuryColors.warmGray,
              fontSize: "0.8rem",
            }}
          >
            © {new Date().getFullYear()} Terrarossa. Tutti i diritti riservati.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default EnterpriseFooter;
