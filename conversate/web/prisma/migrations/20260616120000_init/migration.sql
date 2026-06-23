-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "RobotsStatus" AS ENUM ('allowed', 'disallowed', 'not_checked');

-- CreateEnum
CREATE TYPE "AllowedUsage" AS ENUM ('ui_visible', 'rag_only_no_display', 'internal_only', 'banned');

-- CreateEnum
CREATE TYPE "PiiStatus" AS ENUM ('not_checked', 'none', 'masked', 'contains_pii_blocked');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('public', 'tos_allowed', 'tos_restricted', 'internal_use_only', 'licensed', 'unknown');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('created', 'preflight', 'connecting', 'live', 'ending', 'completed', 'failed', 'abandoned');

-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('behavioral', 'technical', 'case', 'mixed');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'candidate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "didAgentEnvKey" TEXT NOT NULL,
    "primaryRubricId" TEXT,
    "defaultDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "defaultDifficulty" "Difficulty" NOT NULL DEFAULT 'medium',
    "openingQuestion" TEXT,
    "candidateInstructions" TEXT,
    "forbiddenBehavior" TEXT,
    "fallbackBehavior" TEXT,
    "interviewModes" "InterviewMode"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaVersion" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "kbVersionId" TEXT,
    "rubricVersion" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonaVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "personaId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'created',
    "interviewMode" "InterviewMode" NOT NULL DEFAULT 'behavioral',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'medium',
    "kbVersionId" TEXT,
    "rubricVersion" TEXT,
    "promptVersion" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "rubricVersion" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "actionItems" JSONB NOT NULL,
    "evidence" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelRun" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scoreId" TEXT,
    "personaId" TEXT NOT NULL,
    "modelProvider" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "rubricVersion" TEXT NOT NULL,
    "kbVersion" TEXT,
    "inputHash" TEXT NOT NULL,
    "outputJson" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION,
    "latencyMs" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "retrievalTrace" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbSource" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceType" TEXT NOT NULL,
    "captureMethod" TEXT NOT NULL,
    "licenseStatus" "LicenseStatus" NOT NULL DEFAULT 'unknown',
    "robotsStatus" "RobotsStatus" NOT NULL DEFAULT 'not_checked',
    "allowedUsage" "AllowedUsage" NOT NULL DEFAULT 'internal_only',
    "piiStatus" "PiiStatus" NOT NULL DEFAULT 'not_checked',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "retentionPolicy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbDocument" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT,
    "rawText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "personaId" TEXT,
    "kbVersionId" TEXT,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "qualityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbVersion" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperRun" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "manifest" JSONB,

    CONSTRAINT "ScraperRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperItem" (
    "id" TEXT NOT NULL,
    "scraperRunId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "status" TEXT NOT NULL,
    "rawMeta" JSONB,

    CONSTRAINT "ScraperItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackRating" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "provider" TEXT NOT NULL,
    "amountUsd" DOUBLE PRECISION NOT NULL,
    "units" DOUBLE PRECISION,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "diff" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSkillSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "rollingScore" DOUBLE PRECISION NOT NULL,
    "sessionCount" INTEGER NOT NULL,
    "lastSessionId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateSkillSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE INDEX "Consent_userId_idx" ON "Consent"("userId");

-- CreateIndex
CREATE INDEX "PersonaVersion_personaId_createdAt_idx" ON "PersonaVersion"("personaId", "createdAt");

-- CreateIndex
CREATE INDEX "Session_userId_createdAt_idx" ON "Session"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Session_personaId_createdAt_idx" ON "Session"("personaId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_sessionId_sequence_idx" ON "Message"("sessionId", "sequence");

-- CreateIndex
CREATE INDEX "Score_sessionId_idx" ON "Score"("sessionId");

-- CreateIndex
CREATE INDEX "ModelRun_sessionId_idx" ON "ModelRun"("sessionId");

-- CreateIndex
CREATE INDEX "KbSource_approvalStatus_sourceType_idx" ON "KbSource"("approvalStatus", "sourceType");

-- CreateIndex
CREATE INDEX "KbChunk_personaId_approvalStatus_idx" ON "KbChunk"("personaId", "approvalStatus");

-- CreateIndex
CREATE INDEX "KbChunk_kbVersionId_idx" ON "KbChunk"("kbVersionId");

-- CreateIndex
CREATE INDEX "CostEvent_createdAt_provider_idx" ON "CostEvent"("createdAt", "provider");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_actorId_idx" ON "AuditLog"("createdAt", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkillSnapshot_userId_personaId_skillName_key" ON "CandidateSkillSnapshot"("userId", "personaId", "skillName");

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaVersion" ADD CONSTRAINT "PersonaVersion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelRun" ADD CONSTRAINT "ModelRun_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelRun" ADD CONSTRAINT "ModelRun_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbDocument" ADD CONSTRAINT "KbDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KbSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbChunk" ADD CONSTRAINT "KbChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "KbDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbChunk" ADD CONSTRAINT "KbChunk_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KbSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbChunk" ADD CONSTRAINT "KbChunk_kbVersionId_fkey" FOREIGN KEY ("kbVersionId") REFERENCES "KbVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScraperItem" ADD CONSTRAINT "ScraperItem_scraperRunId_fkey" FOREIGN KEY ("scraperRunId") REFERENCES "ScraperRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackRating" ADD CONSTRAINT "FeedbackRating_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEvent" ADD CONSTRAINT "CostEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkillSnapshot" ADD CONSTRAINT "CandidateSkillSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkillSnapshot" ADD CONSTRAINT "CandidateSkillSnapshot_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
