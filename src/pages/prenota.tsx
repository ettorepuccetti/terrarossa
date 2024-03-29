import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import { type NextPage } from "next";
import Head from "next/head";
import Calendar from "~/components/Calendar";
import Header from "~/components/Header";
const Prenota: NextPage = () => {
  return (
    <>
      <Head>
        <title>Prenota</title>
        <meta name="description" content="" />
      </Head>
      <Header />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
        <Calendar />
      </LocalizationProvider>
    </>
  );
};

export default Prenota;
