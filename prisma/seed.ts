import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const foroItalico = await prisma.club.upsert({
    where: { name: "Foro Italico" },
    update: {},
    create: {
      name: "Foro Italico",
      logoSrc:
        "https://pub-f960339d8fe045c9a40b730d5aff9632.r2.dev/bnl-logo.png",
      courts: {
        create: [
          {
            name: "Centrale",
            surface: "Clay",
            indoor: false,
          },
          {
            name: "Pietrangeli",
            surface: "Clay",
            indoor: false,
          },
          {
            name: "Campo 1",
            surface: "Clay",
            indoor: false,
            beginTime: "HOUR",
          },
        ],
      },
    },
  });
  console.log("Seeding database...");
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
