import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { luxuryColors } from "./EnterpriseHero";

const navItems = [
  { label: "Funzionalità", href: "#features" },
  { label: "Circoli", href: "/search" },
];

const LandingHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          py: 2,
          backdropFilter: "blur(20px)",
          bgcolor: alpha(luxuryColors.cream, 0.92),
          borderBottom: "1px solid",
          borderColor: luxuryColors.lightGray,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Terrarossa
                </Typography>
              </Box>
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                {navItems.map((item) => (
                  <Typography
                    key={item.label}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: luxuryColors.warmGray,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: luxuryColors.terracotta,
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Box>
            )}

            {/* CTA Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                component={Link}
                href="/search"
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  borderRadius: "2px",
                  bgcolor: luxuryColors.terracotta,
                  textTransform: "none",
                  letterSpacing: "0.05em",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: luxuryColors.terracottaDark,
                    boxShadow: "none",
                  },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Entra
              </Button>

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ color: luxuryColors.darkText }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: luxuryColors.cream,
            borderLeft: "1px solid",
            borderColor: luxuryColors.lightGray,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Image
              src="/mstile-144x144.png"
              alt="Terrarossa"
              width={32}
              height={32}
              style={{ borderRadius: 4 }}
            />
            <Typography
              sx={{
                color: luxuryColors.darkText,
                fontWeight: 500,
                fontFamily:
                  "'Playfair Display', Georgia, 'Times New Roman', serif",
              }}
            >
              Terrarossa
            </Typography>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: alpha(luxuryColors.terracotta, 0.05),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: luxuryColors.warmGray, fontWeight: 400 },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              href="/search"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: "2px",
                bgcolor: luxuryColors.terracotta,
                textTransform: "none",
                fontWeight: 500,
                letterSpacing: "0.05em",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: luxuryColors.terracottaDark,
                  boxShadow: "none",
                },
              }}
            >
              Entra
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default LandingHeader;
