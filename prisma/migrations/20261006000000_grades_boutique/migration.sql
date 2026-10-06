-- AlterTable
ALTER TABLE "user" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "coinsDay" TEXT,
ADD COLUMN     "coinsEarnedToday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "grade" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "gradeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "ownedThemes" TEXT[] DEFAULT ARRAY['classique']::TEXT[];

