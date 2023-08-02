import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography, useTheme, type SxProps } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import React from "react";
import { appNameInHeader, defaultLogoSrc } from "~/utils/constants";
import Drawer from "./DrawerWrapper";

const toolbarStyle: SxProps = {
  backgroundColor: "white",
  padding: "20px",
  height: "10vh",
  justifyContent: "space-between",
  display: "flex",
};

export default function Header({
  headerName,
  logoSrc,
}: {
  headerName?: string | undefined;
  logoSrc?: string | undefined | null;
}) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const theme = useTheme();

  return (
    <>
      <AppBar position={"fixed"}>
        <Toolbar sx={toolbarStyle} disableGutters>
          <Box display={"flex"} flex={1}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={() => setOpenDrawer(!openDrawer)}
              data-test="drawer-button"
            >
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} />
          </Box>

          {/* Name */}
          <Typography
            variant="h5"
            fontWeight={500}
            color={headerName ? "black" : theme.palette.primary.main}
          >
            {headerName ?? appNameInHeader}
          </Typography>

          {/* Logo */}
          <Box display={"flex"} flex={1} justifyContent={"flex-end"}>
            <Image
              src={logoSrc ?? defaultLogoSrc}
              alt="logo"
              width={50}
              height={50}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* empty toolbar for prevent page content going behind the real toolbar */}
      <Toolbar sx={toolbarStyle} />
    </>
  );
}
