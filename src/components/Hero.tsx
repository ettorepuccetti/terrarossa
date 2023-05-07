import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import styles from '../styles/Hero.module.css';
import Image from 'next/image';
import heroSrc from '../../public/images/myteam.jpg';
import Link from 'next/link';

const Hero = () => {

  return (
    <Box className={styles.heroBox}>
      <Grid container spacing={6} className={styles.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            Prenota ora il tuo campo da tennis
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            Con Terrarogue.
          </Typography>
          <Link href="/prenota">
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '200px', fontSize: '16px' }}
            >
              PRENOTA
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={5}>
          <Image src={heroSrc} alt="My Team" className={styles.largeImage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;