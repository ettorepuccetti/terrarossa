import { Box } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import CircoliClients from "~/components/landing-page/CircoliClients";
import CircoliFeatureGrid from "~/components/landing-page/CircoliFeatureGrid";
import CircoliHero from "~/components/landing-page/CircoliHero";
import CircoliHowItWorks from "~/components/landing-page/CircoliHowItWorks";
import CircoliRoadmap from "~/components/landing-page/CircoliRoadmap";
import CircoliStickyCTA from "~/components/landing-page/CircoliStickyCTA";
import CircoliTeam from "~/components/landing-page/CircoliTeam";
import CircoliTestimonials from "~/components/landing-page/CircoliTestimonials";
import LandingSwitch from "~/components/landing-page/LandingSwitch";
import TennistiClients from "~/components/landing-page/TennistiClients";
import TennistiCTA from "~/components/landing-page/TennistiCTA";
import TennistiFAQ from "~/components/landing-page/TennistiFAQ";
import TennistiFeatureGrid from "~/components/landing-page/TennistiFeatureGrid";
import TennistiHero from "~/components/landing-page/TennistiHero";
import TennistiHowItWorks from "~/components/landing-page/TennistiHowItWorks";
import TennistiTeam from "~/components/landing-page/TennistiTeam";
import TennistiTestimonials from "~/components/landing-page/TennistiTestimonials";
import styles from "~/styles/index.module.css";

export function Screenshot({ alt, src }: { alt: string; src: string }) {
  // Placeholder for generated screenshot, could be replaced with <Image />
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        my: 2,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 6,
        border: "1.5px solid #e0e0e0",
        background: "#fff",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={420}
        height={236}
        style={{ width: "100%", height: "auto" }}
      />
    </Box>
  );
}

const CircoliLanding = () => (
  <Box>
    <CircoliHero />
    <CircoliHowItWorks />
    <CircoliFeatureGrid />
    <CircoliTestimonials />
    <CircoliClients />
    <CircoliTeam />
    <CircoliRoadmap />
    <CircoliStickyCTA />
  </Box>
);

const TennistiLanding = () => (
  <Box>
    <TennistiHero />
    <TennistiHowItWorks />
    <TennistiFeatureGrid />
    <TennistiTestimonials />
    <TennistiClients />
    <TennistiTeam />
    <TennistiFAQ />
    <TennistiCTA />
  </Box>
);

const Home: NextPage = () => {
  const [audience, setAudience] = useState<"circoli" | "tennisti">("tennisti");
  return (
    <>
      <Head>
        <title>Terrarossa</title>
        <meta name="description" content="" />
        <meta
          name="google-site-verification"
          content="o13uxXhXF5TtrrsmtA8H3Uqy9eNimvm29w24v1bhUOs"
        />
      </Head>
      <main className={styles.wrapper}>
        <Header />
        <LandingSwitch audience={audience} setAudience={setAudience} />
        {audience === "circoli" ? <CircoliLanding /> : <TennistiLanding />}
        <Footer />
      </main>
    </>
  );
};

export default Home;
