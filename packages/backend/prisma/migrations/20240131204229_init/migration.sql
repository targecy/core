/*
  Warnings:

  - You are about to drop the `Segment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Segment";

-- CreateTable
CREATE TABLE "Reach" (
    "hash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "subject" JSONB NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "Reach_pkey" PRIMARY KEY ("hash","type","issuer")
);
