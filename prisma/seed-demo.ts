import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Rome");

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  syncUrl: process.env.TURSO_SYNC_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const adapter = new PrismaLibSQL(libsql);

const prisma = new PrismaClient({ adapter });

async function main() {
  //clean up - TODO: fully erase the db
  await prisma.recurrentReservation.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.club.deleteMany();
  await prisma.court.deleteMany();
  await prisma.clubSettings.deleteMany();
  await prisma.user.deleteMany();

  //clubs
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
      PhoneNumber: { create: foroItalicoPhone },
      mail: "ticketoffice@federtennis.it",
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
      imageSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "wimbledon-image.jpg",
      logoSrc: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "wimbledon-logo.png",
      Address: { create: allEnglandAddress },
      PhoneNumber: { create: allEnglandPhone },
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

  //courts
  const centraleForo = await prisma.court.create({
    data: {
      clubId: foroItalico.id,
      name: centralCourtName,
      surface: "Clay",
      indoor: false,
    },
  });

  const pietrangeli = await prisma.court.create({
    data: {
      clubId: foroItalico.id,
      name: pietrangeliCourtName,
      surface: "Clay",
      indoor: false,
    },
  });

  const court1foro = await prisma.court.create({
    data: {
      clubId: foroItalico.id,
      name: court1ForoName,
      surface: "Clay",
      indoor: false,
    },
  });

  //users
  const adminUser = await prisma.user.upsert({
    where: { email: "adminuser@terrarossa.app" },
    update: {},
    create: {
      email: "adminuser@terrarossa.app",
      name: "admin",
      role: "ADMIN",
      image: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "bnl-logo.png",
      clubId: foroItalico.id,
      accounts: {
        create: {
          type: "oauth",
          provider: "auth0",
          providerAccountId: "auth0|654df6e87a8e265bbdabde5b",
          scope: "openid profile email",
        },
      },
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demouser@terrarossa.app" },
    update: {},
    create: {
      email: "demouser@terrarossa.app",
      name: "demo user",
      role: "USER",
      image: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "user_demo_avatar.png",
      accounts: {
        create: {
          type: "oauth",
          provider: "auth0",
          providerAccountId: "auth0|654df6952dd07ff7320aa86e",
          scope: "openid profile email",
        },
      },
    },
  });

  const federerUser = await prisma.user.create({
    data: {
      email: "r.federer@atp.com",
      name: "Roger Federer",
      role: "USER",
      image: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "federer_avatar.jpg",
    },
  });

  const marioRossi = await prisma.user.create({
    data: {
      email: "mariorossi@personal.it",
      name: "Mario Rossi",
      role: "USER",
      image: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "mario_avatar.jpg",
    },
  });

  const giovanni = await prisma.user.create({
    data: {
      email: "giovanni@personal.it",
      name: "Giovanni",
      role: "USER",
      image: process.env.NEXT_PUBLIC_R2_BUCKET_URL + "giovane_avatar.jpg",
    },
  });

  //recurrent reservations (by admin only)
  await prisma.recurrentReservation.create({
    data: {
      startDate: dayjs.tz().startOf("day").toDate(),
      endDate: dayjs.tz().add(2, "weeks").startOf("day").toDate(),
      reservations: {
        createMany: {
          data: [
            {
              overwriteName: "Mini Tennis U10",
              courtId: pietrangeli.id,
              userId: adminUser.id,
              startTime: dayjs.tz().hour(14).startOf("hour").toDate(),
              endTime: dayjs.tz().hour(16).startOf("hour").toDate(),
            },
            {
              overwriteName: "Mini Tennis U10",
              courtId: pietrangeli.id,
              userId: adminUser.id,
              startTime: dayjs
                .tz()
                .add(1, "week")
                .hour(14)
                .startOf("hour")
                .toDate(),
              endTime: dayjs
                .tz()
                .add(1, "week")
                .hour(16)
                .startOf("hour")
                .toDate(),
            },
          ],
        },
      },
    },
  });

  await prisma.recurrentReservation.create({
    data: {
      startDate: dayjs.tz().startOf("day").toDate(),
      endDate: dayjs.tz().add(2, "weeks").startOf("day").toDate(),
      reservations: {
        createMany: {
          data: [
            {
              overwriteName: "Ago U16",
              courtId: court1foro.id,
              userId: adminUser.id,
              startTime: dayjs.tz().hour(14).startOf("hour").toDate(),
              endTime: dayjs.tz().hour(16).startOf("hour").toDate(),
            },
            {
              overwriteName: "Ago U16",
              courtId: court1foro.id,
              userId: adminUser.id,
              startTime: dayjs
                .tz()
                .add(1, "week")
                .hour(14)
                .startOf("hour")
                .toDate(),
              endTime: dayjs
                .tz()
                .add(1, "week")
                .hour(16)
                .startOf("hour")
                .toDate(),
            },
          ],
        },
      },
    },
  });

  //reservations
  await prisma.reservation.createMany({
    data: [
      {
        courtId: pietrangeli.id,
        userId: marioRossi.id,
        startTime: dayjs.tz().hour(17).startOf("hour").toDate(),
        endTime: dayjs.tz().hour(19).startOf("hour").toDate(),
      },
      {
        courtId: centraleForo.id,
        userId: demoUser.id,
        startTime: dayjs.tz().hour(10).startOf("hour").toDate(),
        endTime: dayjs.tz().hour(11).startOf("hour").toDate(),
      },
      {
        courtId: centraleForo.id,
        userId: federerUser.id,
        startTime: dayjs.tz().hour(12).startOf("hour").toDate(),
        endTime: dayjs.tz().hour(13).startOf("hour").toDate(),
      },
      {
        courtId: court1foro.id,
        userId: giovanni.id,
        startTime: dayjs.tz().hour(19).minute(30).startOf("minute").toDate(),
        endTime: dayjs.tz().hour(20).minute(30).startOf("minute").toDate(),
      },
    ],
  });

  //admin reservations
  await prisma.reservation.createMany({
    data: [
      {
        courtId: centraleForo.id,
        userId: adminUser.id,
        startTime: dayjs.tz().hour(15).startOf("hour").toDate(),
        endTime: dayjs.tz().hour(16).startOf("hour").toDate(),
        overwriteName: "Prenotazione esterno",
      },
    ],
  });
  console.log("Seeding database...");
  console.log(allEnglandClub);
  console.log(foroItalico);
  console.log(centraleForo);
  console.log(pietrangeli);
  console.log(adminUser);
  console.log(demoUser);
}

main()
  .then(async () => {
    await libsql.sync();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
