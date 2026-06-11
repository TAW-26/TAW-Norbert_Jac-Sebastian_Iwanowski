-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "diet" TEXT DEFAULT '-',
ADD COLUMN     "interests" TEXT DEFAULT '-',
ADD COLUMN     "pace" TEXT DEFAULT '-',
ADD COLUMN     "transport" TEXT DEFAULT '-';
