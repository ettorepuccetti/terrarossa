/*
  Warnings:

  - You are about to drop the column `Name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `Premium` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `Covered` on the `Court` table. All the data in the column will be lost.
  - Added the required column `name` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "premium" BOOLEAN DEFAULT false
);
INSERT INTO "new_Client" ("id") SELECT "id" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Court" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "covered" BOOLEAN DEFAULT false
);
INSERT INTO "new_Court" ("id") SELECT "id" FROM "Court";
DROP TABLE "Court";
ALTER TABLE "new_Court" RENAME TO "Court";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
