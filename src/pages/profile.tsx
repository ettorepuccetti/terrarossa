import { type NextPage } from "next";
import Header from "~/components/Header";
import { Profile } from "~/components/Profile";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Header />
      <Profile />
    </>
  );
};

export default ProfilePage;
