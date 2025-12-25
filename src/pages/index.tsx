import { Box } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import CTASection from "~/components/landing/CTASection";
import EnterpriseFooter from "~/components/landing/EnterpriseFooter";
import EnterpriseHero, {
  luxuryColors,
} from "~/components/landing/EnterpriseHero";
import FeatureShowcase from "~/components/landing/FeatureShowcase";
import HowItWorksSection from "~/components/landing/HowItWorksSection";
import LandingHeader from "~/components/landing/LandingHeader";
import StatsSection from "~/components/landing/StatsSection";
import TennistiSection from "~/components/landing/TennistiSection";
import TestimonialsSection from "~/components/landing/TestimonialsSection";
import UIShowcase from "~/components/landing/UIShowcase";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Terrarossa | Prenotazioni per Circoli di Tennis d&apos;Eccellenza
        </title>
        <meta
          name="description"
          content="Sistema di prenotazione elegante per circoli di tennis esclusivi. Un'esperienza raffinata per i vostri soci."
        />
        <meta
          name="google-site-verification"
          content="o13uxXhXF5TtrrsmtA8H3Uqy9eNimvm29w24v1bhUOs"
        />
        <meta name="theme-color" content={luxuryColors.cream} />
      </Head>
      <Box
        component="main"
        sx={{
          bgcolor: luxuryColors.cream,
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <LandingHeader />
        <EnterpriseHero />
        <FeatureShowcase />
        <UIShowcase />
        <TennistiSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
        <EnterpriseFooter />
      </Box>
    </>
  );
};

export default Home;
