import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import ReservationDrawer from './ReservationDrawer';

const toolbarStyle = {
  backgroundColor: "white",
  padding:"20px",
  height:"10vh"
}

export default function ReservationHeader() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  return (
    <>
  
      <AppBar position={'fixed'}  /*  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} */ >
        <Toolbar sx={toolbarStyle} disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(_e) => setOpenDrawer(!openDrawer)}
          >
            <MenuIcon sx={{ color: "black"}} />
          </IconButton>
          <ReservationDrawer open={openDrawer} setOpen={setOpenDrawer} />
        </Toolbar>
      </AppBar>

      {/* empty toolbar for prevent page content going behind the real toolbar */}
      <Toolbar sx={toolbarStyle}/>
    </>
  );
}