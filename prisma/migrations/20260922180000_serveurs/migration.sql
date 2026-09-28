-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "serverId" TEXT;

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_inviteCode_key" ON "Server"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "ServerMember_userId_serverId_key" ON "ServerMember"("userId", "serverId");

-- CreateIndex
CREATE INDEX "Conversation_serverId_idx" ON "Conversation"("serverId");

-- AddForeignKey
ALTER TABLE "ServerMember" ADD CONSTRAINT "ServerMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMember" ADD CONSTRAINT "ServerMember_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Données : les canaux existants (#info, #général, canaux publics) forment le serveur par défaut « Helix »,
-- dont tous les utilisateurs sont membres (les admins du site en sont admins).
INSERT INTO "Server" ("id", "name", "inviteCode") VALUES ('helix', 'Helix', 'helix');

UPDATE "Conversation" SET "serverId" = 'helix' WHERE "type" IN ('INFO', 'PUBLIC');

INSERT INTO "ServerMember" ("id", "userId", "serverId", "role")
SELECT 'helix_' || "id", "id", 'helix', CASE WHEN "isAdmin" THEN 'ADMIN'::"Role" ELSE 'MEMBER'::"Role" END
FROM "user";
