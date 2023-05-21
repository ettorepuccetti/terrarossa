import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import styles from '../styles/Footer.module.css';
import NextLink from 'next/link';

const Footer = () => {

  return (
    <Box className={styles.footerContainer}>
      {/* <Typography className={styles.footerText}>
        Provided with ❤️ by{' '}
        <Link href="https://github.com/ettorepuccetti" target="_blank" underline="none">
          EP
        </Link>
      </Typography> */}
      <Box display={'flex'} gap={2.5}>
      <NextLink href={"/terms"}>
        <Typography className={styles.footerDate} sx={{textDecoration: "underline"}}> Terms of Service </Typography>
      </NextLink>
      <NextLink href={"/privacy"}>
        <Typography className={styles.footerDate} sx={{textDecoration: "underline"}}> Privacy Policy </Typography>
      </NextLink>
      </Box>
    </Box>
  );
};

export default Footer;