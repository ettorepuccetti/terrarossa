/*
  Warnings:

  - You are about to drop the column `clubId` on the `PhoneNumber` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageSrc" TEXT,
    "logoSrc" TEXT,
    "mail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "clubSettingsId" TEXT NOT NULL,
    "phoneNumberId" TEXT,
    CONSTRAINT "Club_clubSettingsId_fkey" FOREIGN KEY ("clubSettingsId") REFERENCES "ClubSettings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Club_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "PhoneNumber" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("clubSettingsId", "createdAt", "id", "imageSrc", "logoSrc", "mail", "name", "updatedAt") SELECT "clubSettingsId", "createdAt", "id", "imageSrc", "logoSrc", "mail", "name", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_id_key" ON "Club"("id");
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
CREATE UNIQUE INDEX "Club_clubSettingsId_key" ON "Club"("clubSettingsId");
CREATE UNIQUE INDEX "Club_phoneNumberId_key" ON "Club"("phoneNumberId");
CREATE TABLE "new_PhoneNumber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "nationalPrefix" TEXT NOT NULL
);
INSERT INTO "new_PhoneNumber" ("id", "nationalPrefix", "number") SELECT "id", "nationalPrefix", "number" FROM "PhoneNumber";
DROP TABLE "PhoneNumber";
ALTER TABLE "new_PhoneNumber" RENAME TO "PhoneNumber";
CREATE UNIQUE INDEX "PhoneNumber_id_key" ON "PhoneNumber"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "clubId" TEXT,
    "phoneNumberId" TEXT,
    CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "PhoneNumber" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("clubId", "createdAt", "email", "emailVerified", "id", "image", "name", "role", "updatedAt") SELECT "clubId", "createdAt", "email", "emailVerified", "id", "image", "name", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phoneNumberId_key" ON "User"("phoneNumberId");
CREATE INDEX "User_clubId_idx" ON "User"("clubId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
