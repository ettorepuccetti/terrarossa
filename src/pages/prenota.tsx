import { Container } from "@mui/material";
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
      <Container maxWidth={"md"} sx={{ padding: 0 }}>
        <Calendar />
      </Container>
    </>
  );
};

export default Prenota;
