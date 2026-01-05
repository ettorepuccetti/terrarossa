import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  allEnglandAddress,
  allEnglandClubName,
  allEnglandPhone,
  centerCourtName,
  centralCourtName,
  court1AllEngName,
  court1ForoName,
  foroItalicoAddress,
  foroItalicoName,
  foroItalicoPhone,
  pietrangeliCourtName,
} from "../src/utils/constants";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
  const foroItalico = await prisma.club.upsert({
    where: { name: foroItalicoName },
    update: {},
    create: {
      name: foroItalicoName,
      logoSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "bnl-logo.png",
      imageSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "bnl-image.jpg",
      Address: {
        create: foroItalicoAddress,
      },
      PhoneNumber: {
        create: foroItalicoPhone,
      },
      mail: "ticketoffice@federtennis.it",
      courts: {
        create: [
          {
            name: centralCourtName,
            surface: "Clay",
            indoor: false,
          },
          {
            name: pietrangeliCourtName,
            surface: "Clay",
            indoor: false,
          },
          {
            name: court1ForoName,
            surface: "Clay",
            indoor: false,
            beginTime: "HOUR",
          },
        ],
      },
      clubSettings: {
        create: {
          daysInFutureVisible: 7,
          daysInThePastVisible: 3,
        },
      },
    },
  });

  const allEnglandClub = await prisma.club.upsert({
    where: { name: allEnglandClubName },
    update: {},
    create: {
      name: allEnglandClubName,
      imageSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "wimbledon-image.jpg",
      logoSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "wimbledon-logo.png",
      Address: {
        create: allEnglandAddress,
      },
      PhoneNumber: {
        create: allEnglandPhone,
      },
      mail: "info@wimbledon-village.com",
      clubSettings: {
        create: {
          daysInFutureVisible: 5,
          daysInThePastVisible: 2,
        },
      },
      courts: {
        create: [
          {
            name: centerCourtName,
            surface: "Grass",
            indoor: true,
          },
          {
            name: court1AllEngName,
            surface: "Grass",
            indoor: false,
          },
        ],
      },
    },
  });

  const adminForoItalico = await prisma.user.upsert({
    where: { email: process.env.CYPRESS_ADMIN_FORO_MAIL },
    update: {},
    create: {
      email: process.env.CYPRESS_ADMIN_FORO_MAIL,
      name: "admin-foro",
      role: "ADMIN",
      clubId: foroItalico.id,
      accounts: {
        create: {
          type: "oauth",
          provider: "auth0",
          providerAccountId: "auth0|649eaa3b9391b8386a3519c8",
          scope: "openid profile email",
        },
      },
    },
  });

  // adding another user for when I want to create a reservation for an user different from the one who is logged in
  const user2 = await prisma.user.upsert({
    where: { email: process.env.CYPRESS_USER2_MAIL },
    update: {},
    create: {
      email: process.env.CYPRESS_USER2_MAIL,
      name: "user2",
      role: "USER",
      accounts: {
        create: {
          type: "oauth",
          provider: "auth0",
          providerAccountId: "auth0|64fdd616155c5381cdc2f9ec",
          scope: "openid profile email",
        },
      },
    },
  });

  console.log("Seeding database...");
  console.log(allEnglandClub);
  console.log(foroItalico);
  console.log(adminForoItalico);
  console.log(user2);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
