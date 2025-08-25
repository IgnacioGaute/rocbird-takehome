/*
  Warnings:

  - Changed the type of `seniority` on the `Talento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Seniority" AS ENUM ('JUNIOR', 'SEMI_SENIOR', 'SENIOR');

-- AlterTable
ALTER TABLE "public"."Talento" DROP COLUMN "seniority",
ADD COLUMN     "seniority" "public"."Seniority" NOT NULL;
