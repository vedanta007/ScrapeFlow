/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Credential_name_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_name_key" ON "Credential"("userId", "name");
