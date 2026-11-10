-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationToken" TEXT,
    "unsubscribeToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmailSubscriptionToLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmailSubscriptionToLocation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_email_key" ON "EmailSubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_verificationToken_key" ON "EmailSubscription"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_unsubscribeToken_key" ON "EmailSubscription"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "EmailSubscription_isVerified_isActive_idx" ON "EmailSubscription"("isVerified", "isActive");

-- CreateIndex
CREATE INDEX "_EmailSubscriptionToLocation_B_index" ON "_EmailSubscriptionToLocation"("B");

-- AddForeignKey
ALTER TABLE "_EmailSubscriptionToLocation" ADD CONSTRAINT "_EmailSubscriptionToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "EmailSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailSubscriptionToLocation" ADD CONSTRAINT "_EmailSubscriptionToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
