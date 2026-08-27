-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'FILLED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "WorkerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "skills" TEXT[],
    "experience" INTEGER,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaborJob" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "estateName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "workersRequired" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "wagePerDay" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaborJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaborApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaborApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerProfile_userId_key" ON "WorkerProfile"("userId");

-- CreateIndex
CREATE INDEX "LaborJob_ownerId_idx" ON "LaborJob"("ownerId");

-- CreateIndex
CREATE INDEX "LaborJob_location_idx" ON "LaborJob"("location");

-- CreateIndex
CREATE INDEX "LaborJob_status_idx" ON "LaborJob"("status");

-- CreateIndex
CREATE INDEX "LaborApplication_jobId_idx" ON "LaborApplication"("jobId");

-- CreateIndex
CREATE INDEX "LaborApplication_workerId_idx" ON "LaborApplication"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "LaborApplication_jobId_workerId_key" ON "LaborApplication"("jobId", "workerId");

-- AddForeignKey
ALTER TABLE "WorkerProfile" ADD CONSTRAINT "WorkerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborJob" ADD CONSTRAINT "LaborJob_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborApplication" ADD CONSTRAINT "LaborApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "LaborJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborApplication" ADD CONSTRAINT "LaborApplication_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "WorkerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
