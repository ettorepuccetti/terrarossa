import { Box, Typography } from "@mui/material";
import NextLink from "next/link";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <Box className={styles.footerContainer}>
      <Box display={"flex"} gap={2.5}>
        <NextLink href={"/terms"}>
          <Typography
            className={styles.footerDate}
            sx={{ textDecoration: "underline" }}
          >
            Terms of Service
          </Typography>
        </NextLink>
        <NextLink href={"/privacy"}>
          <Typography
            className={styles.footerDate}
            sx={{ textDecoration: "underline" }}
          >
            Privacy Policy
          </Typography>
        </NextLink>
      </Box>
    </Box>
  );
};

export default Footer;
