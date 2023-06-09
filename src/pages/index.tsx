import { type NextPage } from "next";
import Head from "next/head";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Hero from "~/components/Hero";
import styles from "~/styles/index.module.css";

const Home: NextPage = () => {
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
        <Hero />
        <Footer />
      </main>
    </>
  );
};

export default Home;
