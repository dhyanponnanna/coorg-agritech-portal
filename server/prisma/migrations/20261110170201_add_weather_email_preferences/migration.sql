-- AlterTable
ALTER TABLE "EmailSubscription" ADD COLUMN     "receiveHeavyRain" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "receiveHighTemperature" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "receiveLowTemperature" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "receiveStrongWind" BOOLEAN NOT NULL DEFAULT true;
