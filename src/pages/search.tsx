import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/components/Header";
import { Search } from "~/components/Search";

const SearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terrarossa</title>
        <meta name="description" content="" />
      </Head>

      <Header />
      <Search />
    </>
  );
};

export default SearchPage;
