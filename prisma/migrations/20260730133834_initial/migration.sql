-- CreateEnum
CREATE TYPE "Level" AS ENUM ('A0', 'A1', 'A2', 'B1', 'B2');

-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('FREE', 'PREMIUM', 'PREMIUM_PLUS', 'LIFETIME');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('LESSON', 'CHAT', 'VOCABULARY', 'STREAK');

-- CreateEnum
CREATE TYPE "CareerGoal" AS ENUM ('WORK_IN_RUSSIA', 'IT_COMPANY', 'UNIVERSITY', 'TRAVEL', 'BUSINESS', 'GENERAL');

-- CreateEnum
CREATE TYPE "LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING', 'MIXED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "avatar" TEXT,
    "level" "Level" NOT NULL DEFAULT 'A0',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "googleId" TEXT,
    "appleId" TEXT,
    "subscription" "Subscription" NOT NULL DEFAULT 'FREE',
    "careerGoal" "CareerGoal",
    "learningStyle" "LearningStyle",
    "weakTopics" TEXT[],
    "strongTopics" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" "Level" NOT NULL,
    "order" INTEGER NOT NULL,
    "locationId" TEXT,
    "topics" TEXT[],
    "dialogs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "aiCharacter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,
    "corrections" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "russian" TEXT NOT NULL,
    "uzbek" TEXT NOT NULL,
    "pronunciation" TEXT,
    "example" TEXT,
    "category" TEXT,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVocabulary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grammar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "level" "Level" NOT NULL,
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grammar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "condition" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "coinReward" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "target" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "coinReward" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDailyQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDailyQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "level" "Level" NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStoryProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStoryProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "score" INTEGER NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeechRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "pronunciationScore" DOUBLE PRECISION NOT NULL,
    "fluencyScore" DOUBLE PRECISION NOT NULL,
    "intonationScore" DOUBLE PRECISION NOT NULL,
    "stressScore" DOUBLE PRECISION NOT NULL,
    "pauseScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "feedback" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpeechRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeNode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "mastery" DOUBLE PRECISION NOT NULL,
    "lastReviewedAt" TIMESTAMP(3) NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "lessonsCompleted" INTEGER NOT NULL,
    "chatMessagesSent" INTEGER NOT NULL,
    "vocabularyLearned" INTEGER NOT NULL,
    "xpGained" INTEGER NOT NULL,
    "timeSpentMinutes" INTEGER NOT NULL,
    "weakTopics" TEXT[],
    "improvementRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memoryType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "aiModerator" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "leftAt" TIMESTAMP(3),
    "participationScore" DOUBLE PRECISION,
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEnrollment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL,
    "assignedTasks" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "context" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "objectives" TEXT[],
    "aiScript" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScenarioProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserScenarioProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "topics" TEXT[],
    "level" "Level" NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionTaken" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordMistake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "mistake" TEXT NOT NULL,
    "correction" TEXT NOT NULL,
    "context" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordMistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "dailyTasks" JSONB NOT NULL,
    "weeklyGoals" JSONB NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mission" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MistakeExplanation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "corrected" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "rule" TEXT,
    "examples" TEXT[],
    "exercises" JSONB NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MistakeExplanation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillEvaluation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "exerciseType" TEXT NOT NULL,
    "vocabularyScore" INTEGER NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "pronunciationScore" INTEGER NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "fluencyScore" INTEGER NOT NULL,
    "listeningScore" INTEGER,
    "overallScore" INTEGER NOT NULL,
    "feedback" TEXT,
    "evaluatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillCefrLevel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grammarLevel" "Level" NOT NULL,
    "listeningLevel" "Level" NOT NULL,
    "speakingLevel" "Level" NOT NULL,
    "readingLevel" "Level" NOT NULL,
    "writingLevel" "Level" NOT NULL,
    "overallLevel" "Level" NOT NULL,
    "assessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillCefrLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEvidence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "dialogCount" INTEGER NOT NULL DEFAULT 0,
    "quizCount" INTEGER NOT NULL DEFAULT 0,
    "speakingCount" INTEGER NOT NULL DEFAULT 0,
    "listeningCount" INTEGER NOT NULL DEFAULT 0,
    "readingCount" INTEGER NOT NULL DEFAULT 0,
    "writingCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDifficulty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentDifficulty" TEXT NOT NULL,
    "consecutiveCorrect" INTEGER NOT NULL DEFAULT 0,
    "consecutiveWrong" INTEGER NOT NULL DEFAULT 0,
    "lastAdjustedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDifficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurnRisk" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "predictedChurnDate" TIMESTAMP(3),
    "factors" JSONB NOT NULL,
    "interventionSent" BOOLEAN NOT NULL DEFAULT false,
    "interventionType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurnRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "listeningScore" INTEGER NOT NULL,
    "speakingScore" INTEGER NOT NULL,
    "vocabularyScore" INTEGER NOT NULL,
    "pronunciationScore" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "suggestedLevel" "Level" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "topic" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "generatedContent" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "sessionId" TEXT,
    "deviceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subscription" "Subscription" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "questions" JSONB NOT NULL,
    "answers" JSONB,
    "scoring" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "overallScore" INTEGER,
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShadowingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "topic" TEXT NOT NULL,
    "phrases" JSONB NOT NULL,
    "dialog" JSONB,
    "recordings" JSONB,
    "status" TEXT NOT NULL,
    "overallScore" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShadowingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningReplay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "report" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningReplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceContent" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplacePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplacePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_appleId_key" ON "User"("appleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_appleId_idx" ON "User"("appleId");

-- CreateIndex
CREATE INDEX "Lesson_level_idx" ON "Lesson"("level");

-- CreateIndex
CREATE INDEX "Lesson_order_idx" ON "Lesson"("order");

-- CreateIndex
CREATE INDEX "Lesson_locationId_idx" ON "Lesson"("locationId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");

-- CreateIndex
CREATE INDEX "ChatMessage_chatId_idx" ON "ChatMessage"("chatId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE INDEX "Vocabulary_lessonId_idx" ON "Vocabulary"("lessonId");

-- CreateIndex
CREATE INDEX "Vocabulary_category_idx" ON "Vocabulary"("category");

-- CreateIndex
CREATE INDEX "UserVocabulary_userId_idx" ON "UserVocabulary"("userId");

-- CreateIndex
CREATE INDEX "UserVocabulary_vocabularyId_idx" ON "UserVocabulary"("vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVocabulary_userId_vocabularyId_key" ON "UserVocabulary"("userId", "vocabularyId");

-- CreateIndex
CREATE INDEX "Grammar_level_idx" ON "Grammar"("level");

-- CreateIndex
CREATE INDEX "Grammar_lessonId_idx" ON "Grammar"("lessonId");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "UserDailyQuest_userId_idx" ON "UserDailyQuest"("userId");

-- CreateIndex
CREATE INDEX "UserDailyQuest_questId_idx" ON "UserDailyQuest"("questId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyQuest_userId_questId_date_key" ON "UserDailyQuest"("userId", "questId", "date");

-- CreateIndex
CREATE INDEX "StoryLocation_order_idx" ON "StoryLocation"("order");

-- CreateIndex
CREATE INDEX "StoryLocation_level_idx" ON "StoryLocation"("level");

-- CreateIndex
CREATE INDEX "UserStoryProgress_userId_idx" ON "UserStoryProgress"("userId");

-- CreateIndex
CREATE INDEX "UserStoryProgress_locationId_idx" ON "UserStoryProgress"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStoryProgress_userId_locationId_key" ON "UserStoryProgress"("userId", "locationId");

-- CreateIndex
CREATE INDEX "Certification_userId_idx" ON "Certification"("userId");

-- CreateIndex
CREATE INDEX "Certification_level_idx" ON "Certification"("level");

-- CreateIndex
CREATE INDEX "SpeechRecord_userId_idx" ON "SpeechRecord"("userId");

-- CreateIndex
CREATE INDEX "KnowledgeNode_userId_idx" ON "KnowledgeNode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeNode_userId_topic_key" ON "KnowledgeNode"("userId", "topic");

-- CreateIndex
CREATE INDEX "WeeklyStats_userId_idx" ON "WeeklyStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyStats_userId_weekStart_key" ON "WeeklyStats"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "AIMemory_userId_idx" ON "AIMemory"("userId");

-- CreateIndex
CREATE INDEX "AIMemory_memoryType_idx" ON "AIMemory"("memoryType");

-- CreateIndex
CREATE INDEX "Conversation_scheduledAt_idx" ON "Conversation"("scheduledAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "ConversationParticipant"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_userId_conversationId_key" ON "ConversationParticipant"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_institution_idx" ON "Teacher"("institution");

-- CreateIndex
CREATE INDEX "StudentEnrollment_teacherId_idx" ON "StudentEnrollment"("teacherId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_userId_idx" ON "StudentEnrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEnrollment_teacherId_userId_key" ON "StudentEnrollment"("teacherId", "userId");

-- CreateIndex
CREATE INDEX "Scenario_level_idx" ON "Scenario"("level");

-- CreateIndex
CREATE INDEX "Scenario_context_idx" ON "Scenario"("context");

-- CreateIndex
CREATE INDEX "UserScenarioProgress_userId_idx" ON "UserScenarioProgress"("userId");

-- CreateIndex
CREATE INDEX "UserScenarioProgress_scenarioId_idx" ON "UserScenarioProgress"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UserScenarioProgress_userId_scenarioId_key" ON "UserScenarioProgress"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "GeneratedLesson_userId_idx" ON "GeneratedLesson"("userId");

-- CreateIndex
CREATE INDEX "GeneratedLesson_approved_idx" ON "GeneratedLesson"("approved");

-- CreateIndex
CREATE INDEX "MentorMessage_userId_idx" ON "MentorMessage"("userId");

-- CreateIndex
CREATE INDEX "MentorMessage_read_idx" ON "MentorMessage"("read");

-- CreateIndex
CREATE INDEX "WordMistake_userId_idx" ON "WordMistake"("userId");

-- CreateIndex
CREATE INDEX "WordMistake_word_idx" ON "WordMistake"("word");

-- CreateIndex
CREATE INDEX "WordMistake_date_idx" ON "WordMistake"("date");

-- CreateIndex
CREATE INDEX "StudyPlan_userId_idx" ON "StudyPlan"("userId");

-- CreateIndex
CREATE INDEX "StudyPlan_targetDate_idx" ON "StudyPlan"("targetDate");

-- CreateIndex
CREATE INDEX "DailyMission_userId_idx" ON "DailyMission"("userId");

-- CreateIndex
CREATE INDEX "DailyMission_date_idx" ON "DailyMission"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMission_userId_date_key" ON "DailyMission"("userId", "date");

-- CreateIndex
CREATE INDEX "ReviewSession_userId_idx" ON "ReviewSession"("userId");

-- CreateIndex
CREATE INDEX "ReviewSession_generatedAt_idx" ON "ReviewSession"("generatedAt");

-- CreateIndex
CREATE INDEX "MistakeExplanation_userId_idx" ON "MistakeExplanation"("userId");

-- CreateIndex
CREATE INDEX "TimelineEvent_userId_idx" ON "TimelineEvent"("userId");

-- CreateIndex
CREATE INDEX "TimelineEvent_date_idx" ON "TimelineEvent"("date");

-- CreateIndex
CREATE INDEX "SkillEvaluation_userId_idx" ON "SkillEvaluation"("userId");

-- CreateIndex
CREATE INDEX "SkillEvaluation_exerciseId_idx" ON "SkillEvaluation"("exerciseId");

-- CreateIndex
CREATE INDEX "SkillEvaluation_evaluatedAt_idx" ON "SkillEvaluation"("evaluatedAt");

-- CreateIndex
CREATE INDEX "SkillCefrLevel_userId_idx" ON "SkillCefrLevel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillCefrLevel_userId_key" ON "SkillCefrLevel"("userId");

-- CreateIndex
CREATE INDEX "LearningEvidence_userId_idx" ON "LearningEvidence"("userId");

-- CreateIndex
CREATE INDEX "LearningEvidence_level_idx" ON "LearningEvidence"("level");

-- CreateIndex
CREATE UNIQUE INDEX "LearningEvidence_userId_level_key" ON "LearningEvidence"("userId", "level");

-- CreateIndex
CREATE INDEX "UserDifficulty_userId_idx" ON "UserDifficulty"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDifficulty_userId_key" ON "UserDifficulty"("userId");

-- CreateIndex
CREATE INDEX "ChurnRisk_userId_idx" ON "ChurnRisk"("userId");

-- CreateIndex
CREATE INDEX "ChurnRisk_riskLevel_idx" ON "ChurnRisk"("riskLevel");

-- CreateIndex
CREATE UNIQUE INDEX "ChurnRisk_userId_key" ON "ChurnRisk"("userId");

-- CreateIndex
CREATE INDEX "PlacementTest_userId_idx" ON "PlacementTest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementTest_userId_key" ON "PlacementTest"("userId");

-- CreateIndex
CREATE INDEX "ContentGeneration_userId_idx" ON "ContentGeneration"("userId");

-- CreateIndex
CREATE INDEX "ContentGeneration_status_idx" ON "ContentGeneration"("status");

-- CreateIndex
CREATE INDEX "LearningEvent_userId_idx" ON "LearningEvent"("userId");

-- CreateIndex
CREATE INDEX "LearningEvent_eventType_idx" ON "LearningEvent"("eventType");

-- CreateIndex
CREATE INDEX "LearningEvent_createdAt_idx" ON "LearningEvent"("createdAt");

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Interview_userId_idx" ON "Interview"("userId");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "Interview"("status");

-- CreateIndex
CREATE INDEX "Interview_jobType_idx" ON "Interview"("jobType");

-- CreateIndex
CREATE INDEX "ShadowingSession_userId_idx" ON "ShadowingSession"("userId");

-- CreateIndex
CREATE INDEX "ShadowingSession_status_idx" ON "ShadowingSession"("status");

-- CreateIndex
CREATE INDEX "ShadowingSession_topic_idx" ON "ShadowingSession"("topic");

-- CreateIndex
CREATE INDEX "LearningReplay_userId_idx" ON "LearningReplay"("userId");

-- CreateIndex
CREATE INDEX "LearningReplay_generatedAt_idx" ON "LearningReplay"("generatedAt");

-- CreateIndex
CREATE INDEX "MarketplaceContent_teacherId_idx" ON "MarketplaceContent"("teacherId");

-- CreateIndex
CREATE INDEX "MarketplaceContent_status_idx" ON "MarketplaceContent"("status");

-- CreateIndex
CREATE INDEX "MarketplaceContent_category_idx" ON "MarketplaceContent"("category");

-- CreateIndex
CREATE INDEX "MarketplacePurchase_userId_idx" ON "MarketplacePurchase"("userId");

-- CreateIndex
CREATE INDEX "MarketplacePurchase_contentId_idx" ON "MarketplacePurchase"("contentId");

-- CreateIndex
CREATE INDEX "MarketplacePurchase_teacherId_idx" ON "MarketplacePurchase"("teacherId");

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyQuest" ADD CONSTRAINT "UserDailyQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyQuest" ADD CONSTRAINT "UserDailyQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "DailyQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryProgress" ADD CONSTRAINT "UserStoryProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStoryProgress" ADD CONSTRAINT "UserStoryProgress_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "StoryLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeechRecord" ADD CONSTRAINT "SpeechRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyStats" ADD CONSTRAINT "WeeklyStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMemory" ADD CONSTRAINT "AIMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioProgress" ADD CONSTRAINT "UserScenarioProgress_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordMistake" ADD CONSTRAINT "WordMistake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillCefrLevel" ADD CONSTRAINT "SkillCefrLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurnRisk" ADD CONSTRAINT "ChurnRisk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShadowingSession" ADD CONSTRAINT "ShadowingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplacePurchase" ADD CONSTRAINT "MarketplacePurchase_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "MarketplaceContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
