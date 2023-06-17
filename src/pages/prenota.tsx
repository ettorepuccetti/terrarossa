import { type NextPage } from "next";
import Head from "next/head";
import Calendar from "~/components/Calendar";
import styles from "~/styles/prenota.module.css";

const Prenota: NextPage = () => {

  return (
    <>
      <Head>
        <title>Prenota</title>
        <meta name="description" content="" />
      </Head>
        <div className={styles.main}>
          <Calendar />
        </div>
    </>
  );
};

export default Prenota;
