-- CreateTable
CREATE TABLE "Issuer" (
    "did" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "profileNonce" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issuer_pkey" PRIMARY KEY ("did")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "key" VARCHAR(255) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "issuerDid" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Credential" (
    "did" TEXT NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "credential" JSONB NOT NULL,
    "issuerDid" TEXT NOT NULL,
    "issuedTo" VARCHAR(255) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("did")
);

-- CreateIndex
CREATE INDEX "credential_type" ON "Credential"("type");

-- CreateIndex
CREATE INDEX "credential_identifier" ON "Credential"("identifier");

-- CreateIndex
CREATE INDEX "credential_issuer" ON "Credential"("issuerDid");

-- CreateIndex
CREATE INDEX "credential_issued_to" ON "Credential"("issuedTo");

-- CreateIndex
CREATE INDEX "credential_issued_at" ON "Credential"("issuedAt");

-- CreateIndex
CREATE INDEX "credential_content" ON "Credential" USING GIN ("credential" jsonb_path_ops);

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_issuerDid_fkey" FOREIGN KEY ("issuerDid") REFERENCES "Issuer"("did") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_issuerDid_fkey" FOREIGN KEY ("issuerDid") REFERENCES "Issuer"("did") ON DELETE RESTRICT ON UPDATE CASCADE;
