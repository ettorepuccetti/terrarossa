/*
  Warnings:

  - You are about to drop the column `clubId` on the `PhoneNumber` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PhoneNumber` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhoneNumber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "nationalPrefix" TEXT NOT NULL
);
INSERT INTO "new_PhoneNumber" ("id", "nationalPrefix", "number") SELECT "id", "nationalPrefix", "number" FROM "PhoneNumber";
DROP TABLE "PhoneNumber";
ALTER TABLE "new_PhoneNumber" RENAME TO "PhoneNumber";
CREATE UNIQUE INDEX "PhoneNumber_id_key" ON "PhoneNumber"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
