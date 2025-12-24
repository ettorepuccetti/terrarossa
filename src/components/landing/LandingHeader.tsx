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

const navItems = [
  { label: "Funzionalità", href: "#features" },
  { label: "Per i Circoli", href: "#circoli" },
  { label: "Per i Tennisti", href: "#tennisti" },
  { label: "Prezzi", href: "#pricing" },
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
          bgcolor: alpha("#0a0a0a", 0.8),
          borderBottom: "1px solid",
          borderColor: alpha("#fff", 0.06),
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
                  style={{ borderRadius: 8 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Terrarossa
                </Typography>
              </Box>
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                {navItems.map((item) => (
                  <Typography
                    key={item.label}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: alpha("#fff", 0.7),
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Box>
            )}

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!isMobile && (
                <Button
                  component={Link}
                  href="/search"
                  sx={{
                    color: alpha("#fff", 0.8),
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.05),
                    },
                  }}
                >
                  Accedi
                </Button>
              )}
              <Button
                component={Link}
                href="/search"
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)",
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(230, 81, 0, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ff6d00 0%, #ff9800 100%)",
                    boxShadow: "0 6px 20px rgba(230, 81, 0, 0.4)",
                  },
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Inizia Gratis
              </Button>

              {/* Mobile menu button */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ color: "#fff" }}
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
            bgcolor: "#0a0a0a",
            borderLeft: "1px solid",
            borderColor: alpha("#fff", 0.1),
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
              style={{ borderRadius: 6 }}
            />
            <Typography sx={{ color: "#fff", fontWeight: 700 }}>
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
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.05),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: { color: alpha("#fff", 0.8), fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              component={Link}
              href="/search"
              variant="outlined"
              fullWidth
              sx={{
                borderColor: alpha("#fff", 0.2),
                color: "#fff",
                textTransform: "none",
                py: 1.5,
                borderRadius: "10px",
                "&:hover": {
                  borderColor: alpha("#fff", 0.4),
                  bgcolor: alpha("#fff", 0.05),
                },
              }}
            >
              Accedi
            </Button>
            <Button
              component={Link}
              href="/search"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #ff6d00 0%, #ff9800 100%)",
                },
              }}
            >
              Inizia Gratis
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default LandingHeader;
