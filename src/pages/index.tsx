import { type NextPage } from "next";
import Head from "next/head";
import Footer from "~/components/Footer";
import Hero from "~/components/Hero";
import HomeHeader from "~/components/HomeHeader";
import styles from "~/styles/index.module.css";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Terrarossa</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="o13uxXhXF5TtrrsmtA8H3Uqy9eNimvm29w24v1bhUOs" />
      </Head>
      <main className={styles.wrapper}>
        <HomeHeader />
        <Hero />
         {/* <Section />
        <AboutUs />
        <Testimonial />
        <ContactUs /> */}
        <Footer />
      </main>
    </>
  );
};

export default Home;
