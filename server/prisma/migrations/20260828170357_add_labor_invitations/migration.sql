-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "LaborInvitation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaborInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LaborInvitation_jobId_idx" ON "LaborInvitation"("jobId");

-- CreateIndex
CREATE INDEX "LaborInvitation_workerId_idx" ON "LaborInvitation"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "LaborInvitation_jobId_workerId_key" ON "LaborInvitation"("jobId", "workerId");

-- AddForeignKey
ALTER TABLE "LaborInvitation" ADD CONSTRAINT "LaborInvitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "LaborJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborInvitation" ADD CONSTRAINT "LaborInvitation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
