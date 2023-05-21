import MenuIcon from '@mui/icons-material/Menu';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import styles from '~/styles/Header.module.css';
import HomeDrawer from './HomeDrawer';


const HomeHeader = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <Box className={styles.marginBottom}>
      <AppBar>
        <Toolbar className={styles.toolbar}>

          {/* Menu icon that open the drawer */}
          <Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={(_e) => setOpenDrawer(true)}
            >
              <MenuIcon className={styles.menuIcon} />
            </IconButton>

            <HomeDrawer open={openDrawer} setOpen={setOpenDrawer} />
          </Box>

          {/* Logo with link to home */}
          <NextLink href="#">
            <Typography variant="h5" className={styles.logo}>
              Terrarouge
            </Typography>
          </NextLink>

          {/* empty box to position logo in the center */}
          <Box>
            <IconButton size='large'></IconButton>
            <MenuIcon></MenuIcon>
          </Box>



        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HomeHeader;