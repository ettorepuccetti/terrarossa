import { PrismaClient } from "@prisma/client";
import {
  allEnglandClubName,
  centerCourtName,
  centralCourtName,
  court1Name,
  court2Name,
  foroItalicoName,
  pietrangeliCourtName,
} from "../src/utils/constants";

const prisma = new PrismaClient();
async function main() {
  const foroItalico = await prisma.club.upsert({
    where: { name: foroItalicoName },
    update: {},
    create: {
      name: foroItalicoName,
      logoSrc:
        "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/bnl-logo.png",
      imageSrc:
        "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/bnl-image.jpg",
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
            name: court1Name,
            surface: "Clay",
            indoor: false,
            beginTime: "HOUR",
          },
        ],
      },
      clubSettings: {
        create: {
          daysInFutureVisible: 4,
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
      imageSrc:
        "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/wimbledon-image.jpg",
      logoSrc:
        "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/wimbledon-logo.png",
      clubSettings: {
        create: {
          daysInFutureVisible: 7,
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
            name: court2Name,
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
