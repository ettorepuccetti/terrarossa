import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography, useTheme, type SxProps } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import NextLink from "next/link";
import React from "react";
import ReservationDrawer from "./Drawer";
import Image from "next/image";

const   toolbarStyle: SxProps = {
  backgroundColor: "white",
  padding: "20px",
  height: "10vh",
  justifyContent: "space-between",
  display: "flex",
};

export default function Header() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const theme = useTheme();

  const logoStyle = {
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontWeight: 500,
  };

  return (
    <>
      <AppBar
        position={
          "fixed"
        } /*  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} */
      >
        <Toolbar sx={toolbarStyle} disableGutters>
          <Box display={"flex"} flex={1}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={(_e) => setOpenDrawer(!openDrawer)}
          >
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <ReservationDrawer open={openDrawer} setOpen={setOpenDrawer} />
          </Box>
          
          {/* Name */}
          <NextLink href="/">
            <Typography variant="h5" sx={logoStyle}>
              Terrarossa
            </Typography>
          </NextLink>

          {/* Logo */}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"} >
            <Image src="/mstile-144x144.png" alt="logo" width={50} height={50} />
          </Box>

        </Toolbar>
      </AppBar>

      {/* empty toolbar for prevent page content going behind the real toolbar */}
      <Toolbar sx={toolbarStyle} />
    </>
  );
}
