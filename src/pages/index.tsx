import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "~/components/Header";
import Hero from "~/components/Hero";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Terrarossa</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="o13uxXhXF5TtrrsmtA8H3Uqy9eNimvm29w24v1bhUOs" />
      </Head>
      <main className={styles.main}>
        <Header />
        <Hero />
        {/* <Section />
        <AboutUs />
        <Testimonial />
        <ContactUs />
        <Footer /> */}
      </main>
    </>
  );
};

export default Home;
