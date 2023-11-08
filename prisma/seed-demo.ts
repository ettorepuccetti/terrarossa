import { PrismaClient } from "@prisma/client";
import {
  allEnglandClubName,
  centerCourtName,
  centralCourtName,
  court1AllEngName,
  court1ForoName,
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
          daysInThePastVisible: 0,
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

  console.log("Seeding database...");
  console.log(allEnglandClub);
  console.log(foroItalico);
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
