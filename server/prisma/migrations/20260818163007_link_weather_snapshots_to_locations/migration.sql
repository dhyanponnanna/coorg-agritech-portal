-- DropIndex
DROP INDEX "WeatherSnapshot_location_recordedAt_idx";

-- AlterTable
ALTER TABLE "WeatherSnapshot" ADD COLUMN     "locationId" TEXT;

-- CreateIndex
CREATE INDEX "WeatherSnapshot_locationId_recordedAt_idx" ON "WeatherSnapshot"("locationId", "recordedAt");

-- AddForeignKey
ALTER TABLE "WeatherSnapshot" ADD CONSTRAINT "WeatherSnapshot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
