-- CreateTable
CREATE TABLE "Segment" (
    "hash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "subject" JSONB NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("hash","type","issuer")
);
