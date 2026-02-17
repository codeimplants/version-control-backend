-- AlterTable: Update Admin role default from SUPER_ADMIN to ADMIN
ALTER TABLE "Admin" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- Update existing SUPER_ADMIN records to ADMIN
UPDATE "Admin" SET "role" = 'ADMIN' WHERE "role" = 'SUPER_ADMIN';

-- CreateTable: AppCollaborator
CREATE TABLE "AppCollaborator" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppCollaborator_appId_adminId_key" ON "AppCollaborator"("appId", "adminId");

-- CreateIndex
CREATE INDEX "AppCollaborator_adminId_idx" ON "AppCollaborator"("adminId");

-- CreateIndex
CREATE INDEX "AppCollaborator_appId_idx" ON "AppCollaborator"("appId");

-- AddForeignKey
ALTER TABLE "AppCollaborator" ADD CONSTRAINT "AppCollaborator_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppCollaborator" ADD CONSTRAINT "AppCollaborator_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
