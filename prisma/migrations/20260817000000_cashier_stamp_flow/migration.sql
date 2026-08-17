-- Replace the static counter-QR check-in flow with cashier-verified stamping.
-- Each customer gets a personal QR token; the QrCode table and CheckIn.qrCodeId are no longer needed.

-- AlterTable: add Customer.qrToken as nullable first, backfill, then enforce NOT NULL + unique
ALTER TABLE "Customer" ADD COLUMN "qrToken" TEXT;

UPDATE "Customer" SET "qrToken" = 'c' || substr(md5(random()::text || "id"), 1, 24) WHERE "qrToken" IS NULL;

ALTER TABLE "Customer" ALTER COLUMN "qrToken" SET NOT NULL;

CREATE UNIQUE INDEX "Customer_qrToken_key" ON "Customer"("qrToken");

-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT IF EXISTS "CheckIn_qrCodeId_fkey";

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "qrCodeId";

-- DropTable
DROP TABLE "QrCode";
