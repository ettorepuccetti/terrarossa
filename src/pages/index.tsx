import { Box } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import CTASection from "~/components/landing/CTASection";
import EnterpriseFooter from "~/components/landing/EnterpriseFooter";
import EnterpriseHero from "~/components/landing/EnterpriseHero";
import FeatureShowcase from "~/components/landing/FeatureShowcase";
import HowItWorksSection from "~/components/landing/HowItWorksSection";
import LandingHeader from "~/components/landing/LandingHeader";
import StatsSection from "~/components/landing/StatsSection";
import TestimonialsSection from "~/components/landing/TestimonialsSection";
import TrustedBySection from "~/components/landing/TrustedBySection";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terrarossa | Gestione Prenotazioni Campi da Tennis</title>
        <meta
          name="description"
          content="La piattaforma all-in-one per circoli di tennis. Prenotazioni automatiche, gestione utenti e calendario intelligente per far crescere il tuo club."
        />
        <meta
          name="google-site-verification"
          content="o13uxXhXF5TtrrsmtA8H3Uqy9eNimvm29w24v1bhUOs"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <Box
        component="main"
        sx={{
          bgcolor: "#0a0a0a",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <LandingHeader />
        <EnterpriseHero />
        <TrustedBySection />
        <HowItWorksSection />
        <FeatureShowcase />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <EnterpriseFooter />
      </Box>
    </>
  );
};

export default Home;
