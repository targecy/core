-- CreateTable
CREATE TABLE "Tx" (
    "hash" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Tx_pkey" PRIMARY KEY ("hash")
);
