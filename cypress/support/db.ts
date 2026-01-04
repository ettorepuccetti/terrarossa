import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Extract the file path from DATABASE_URL (format: "file:./prisma/dev.db")
const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
let dbPath = dbUrl.replace("file:", "");

// Resolve relative paths from the project root
if (dbPath.startsWith("./") || dbPath.startsWith("../")) {
  dbPath = path.resolve(process.cwd(), dbPath);
}

const db = new Database(dbPath);

// Type definitions for database results
interface ClubRow {
  id: string;
  name: string;
  imageSrc: string | null;
  logoSrc: string | null;
  clubSettingsId: string;
  mail: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface ReservationRow {
  id: string;
  startTime: string;
  endTime: string;
  courtId: string;
  userId: string | null;
  overwriteName: string | null;
  createdAt: string;
  updatedAt: string;
  recurrentReservationId: string | null;
}

interface CourtRow {
  id: string;
  name: string;
  indoor: number | null;
  surface: string | null;
  beginTime: string;
  clubId: string;
}

interface ClubSettingsRow {
  id: string;
  description: string | null;
  firstBookableHour: number;
  firstBookableMinute: number;
  lastBookableHour: number;
  lastBookableMinute: number;
  daysInThePastVisible: number;
  daysInFutureVisible: number;
  maxReservationPerUser: number;
  createdAt: string;
  updatedAt: string | null;
  hoursBeforeCancel: number;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  role: string;
  clubId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export const cypressDb = {
  queryClubs(): ClubRow[] {
    return db.prepare("SELECT * FROM Club").all() as ClubRow[];
  },

  queryFilteredClubs(filter: string): ClubRow[] {
    return db
      .prepare("SELECT * FROM Club WHERE name LIKE ?")
      .all(`%${filter}%`) as ClubRow[];
  },

  deleteAllReservationsOfClub(clubId: string): { deleted: boolean } {
    // First get all court IDs for this club
    const courts = db
      .prepare("SELECT id FROM Court WHERE clubId = ?")
      .all(clubId) as { id: string }[];
    const courtIds = courts.map((c) => c.id);

    if (courtIds.length > 0) {
      // Get recurrentReservationIds before deleting reservations
      const placeholders = courtIds.map(() => "?").join(",");
      const recurrentIds = db
        .prepare(
          `SELECT DISTINCT recurrentReservationId FROM Reservation WHERE courtId IN (${placeholders}) AND recurrentReservationId IS NOT NULL`,
        )
        .all(...courtIds) as { recurrentReservationId: string }[];

      // Delete reservations
      db.prepare(
        `DELETE FROM Reservation WHERE courtId IN (${placeholders})`,
      ).run(...courtIds);

      // Delete recurrent reservations
      if (recurrentIds.length > 0) {
        const recPlaceholders = recurrentIds.map(() => "?").join(",");
        db.prepare(
          `DELETE FROM RecurrentReservation WHERE id IN (${recPlaceholders})`,
        ).run(...recurrentIds.map((r) => r.recurrentReservationId));
      }
    }
    return { deleted: true };
  },

  getClubSettingsByClubName(clubName: string): ClubSettingsRow | undefined {
    const club = db
      .prepare("SELECT clubSettingsId FROM Club WHERE name = ?")
      .get(clubName) as { clubSettingsId: string } | undefined;

    if (!club) return undefined;

    return db
      .prepare("SELECT * FROM ClubSettings WHERE id = ?")
      .get(club.clubSettingsId) as ClubSettingsRow | undefined;
  },

  getClubByName(clubName: string): ClubRow | undefined {
    return db.prepare("SELECT * FROM Club WHERE name = ?").get(clubName) as
      | ClubRow
      | undefined;
  },

  getUserByEmail(email: string): UserRow | undefined {
    const user = db.prepare("SELECT * FROM User WHERE email = ?").get(email) as
      | UserRow
      | undefined;
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  },

  getClubSettingsById(clubSettingsId: string): ClubSettingsRow | undefined {
    const settings = db
      .prepare("SELECT * FROM ClubSettings WHERE id = ?")
      .get(clubSettingsId) as ClubSettingsRow | undefined;
    if (!settings) {
      throw new Error(`ClubSettings with id ${clubSettingsId} not found`);
    }
    return settings;
  },

  createReservation(data: {
    startTime: Date | string;
    endTime: Date | string;
    clubId: string;
    courtName: string;
    userMail: string;
  }): ReservationRow {
    // Get user ID
    const user = db
      .prepare("SELECT id FROM User WHERE email = ?")
      .get(data.userMail) as { id: string } | undefined;
    if (!user) {
      throw new Error(`User with email ${data.userMail} not found`);
    }

    // Get court ID
    const court = db
      .prepare("SELECT id FROM Court WHERE name = ? AND clubId = ?")
      .get(data.courtName, data.clubId) as { id: string } | undefined;
    if (!court) {
      throw new Error(
        `Court ${data.courtName} not found for club ${data.clubId}`,
      );
    }

    const id = crypto.randomUUID();
    // Handle both Date objects and ISO strings (Cypress serializes dates as strings)
    const startTimeStr =
      typeof data.startTime === "string"
        ? data.startTime
        : data.startTime.toISOString();
    const endTimeStr =
      typeof data.endTime === "string"
        ? data.endTime
        : data.endTime.toISOString();

    db.prepare(
      `INSERT INTO Reservation (id, startTime, endTime, courtId, userId, overwriteName, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    ).run(id, startTimeStr, endTimeStr, court.id, user.id, null);

    return db
      .prepare("SELECT * FROM Reservation WHERE id = ?")
      .get(id) as ReservationRow;
  },

  deleteReservation(reservationId: string): { id: string } {
    const reservation = db
      .prepare("SELECT id FROM Reservation WHERE id = ?")
      .get(reservationId) as { id: string } | undefined;
    if (!reservation) {
      throw new Error(`Reservation with id ${reservationId} not found`);
    }
    db.prepare("DELETE FROM Reservation WHERE id = ?").run(reservationId);
    return { id: reservationId };
  },

  editUsername(userMail: string, newUsername: string): UserRow {
    const user = db
      .prepare("SELECT id FROM User WHERE email = ?")
      .get(userMail) as { id: string } | undefined;
    if (!user) {
      throw new Error(`User with email ${userMail} not found`);
    }
    db.prepare(
      "UPDATE User SET name = ?, image = NULL, updatedAt = datetime('now') WHERE email = ?",
    ).run(newUsername, userMail);
    return db
      .prepare("SELECT * FROM User WHERE email = ?")
      .get(userMail) as UserRow;
  },

  createRecurrentReservation(data: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    db.prepare(
      `INSERT INTO RecurrentReservation (id, startDate, endDate, createdAt)
       VALUES (?, ?, ?, datetime('now'))`,
    ).run(data.id, data.startDate, data.endDate);
  },

  getFirstCourtOfClub(clubId: string): CourtRow | undefined {
    return db
      .prepare("SELECT * FROM Court WHERE clubId = ? LIMIT 1")
      .get(clubId) as CourtRow | undefined;
  },

  getReservationsByClub(clubId: string): ReservationRow[] {
    const courts = db
      .prepare("SELECT id FROM Court WHERE clubId = ?")
      .all(clubId) as { id: string }[];
    const courtIds = courts.map((c) => c.id);

    if (courtIds.length === 0) return [];

    const placeholders = courtIds.map(() => "?").join(",");
    return db
      .prepare(`SELECT * FROM Reservation WHERE courtId IN (${placeholders})`)
      .all(...courtIds) as ReservationRow[];
  },
};
