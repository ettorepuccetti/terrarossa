import { type NextPage } from "next";
import Head from "next/head";
import Calendar from "~/components/Calendar";

const Prenota: NextPage = () => {
  return (
    <>
      <Head>
        <title>Prenota</title>
        <meta name="description" content="" />
      </Head>
      <Calendar />
    </>
  );
};

export default Prenota;
