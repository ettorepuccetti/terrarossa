import {
  AppBar,
  Typography,
  Link,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
} from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '~/styles/Header.module.css';


const Header = () => {
  const links = [
    { id: 1, route: 'About', url: 'https://blog.appseed.us/mui-react-coding-landing-page/' },
    { id: 2, route: 'More Apps', url: 'https://appseed.us/apps/react' },
  ];

  const [state, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={(_e) => setState(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {links.map((link) => (
          <ListItem button key={link.id}>
            <ListItemText primary={link.route} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ marginBottom: '70px' }}>
      <AppBar>
        <Toolbar className={styles.toolbar}>
          <Link href="#" underline="none">
            <Typography variant="h5" className={styles.logo}>
              MUI Sample
            </Typography>
          </Link>

          {matches ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={(_e) => setState(true)}
              >
                <MenuIcon className={styles.menuIcon} />
              </IconButton>

              <Drawer
                anchor="right"
                open={state}
                onClose={toggleDrawer(false)}
              >
                {list()}
              </Drawer>
            </Box>
          ) : <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexGrow: '0.1',
            }}
          >
            {links.map((link) => (
              <Link href={link.url} target="_blank" underline="none" key={link.id}>
                <Typography className={styles.link}>{link.route}</Typography>
              </Link>
            ))}
          </Box>}

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;