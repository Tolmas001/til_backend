import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { ChatModule } from './chat/chat.module';
import { ProgressModule } from './progress/progress.module';
import { GamificationModule } from './gamification/gamification.module';
import { AiLearningModule } from './ai-learning/ai-learning.module';
import { CertificationModule } from './certification/certification.module';
import { SpeechAnalyticsModule } from './speech-analytics/speech-analytics.module';
import { ScenarioModule } from './scenario/scenario.module';
import { AiMentorModule } from './ai-mentor/ai-mentor.module';
import { StudyPlannerModule } from './study-planner/study-planner.module';
import { MemoryModule } from './memory/memory.module';
import { DailyMissionModule } from './daily-mission/daily-mission.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { AdaptiveDifficultyModule } from './adaptive-difficulty/adaptive-difficulty.module';
import { ChurnPredictionModule } from './churn-prediction/churn-prediction.module';
import { PlacementTestModule } from './placement-test/placement-test.module';
import { ContentPipelineModule } from './content-pipeline/content-pipeline.module';
import { LessonStudioModule } from './lesson-studio/lesson-studio.module';
import { TeacherCmsModule } from './teacher-cms/teacher-cms.module';
import { DataLakeModule } from './data-lake/data-lake.module';
import { ParentDashboardModule } from './parent-dashboard/parent-dashboard.module';
import { AiInterviewModule } from './ai-interview/ai-interview.module';
import { ShadowingModeModule } from './shadowing-mode/shadowing-mode.module';
import { CoachTimelineModule } from './coach-timeline/coach-timeline.module';
import { LearningReplayModule } from './learning-replay/learning-replay.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LessonsModule,
    ChatModule,
    ProgressModule,
    GamificationModule,
    AiLearningModule,
    CertificationModule,
    SpeechAnalyticsModule,
    ScenarioModule,
    AiMentorModule,
    StudyPlannerModule,
    MemoryModule,
    DailyMissionModule,
    EvaluationModule,
    AdaptiveDifficultyModule,
    ChurnPredictionModule,
    PlacementTestModule,
    ContentPipelineModule,
    LessonStudioModule,
    TeacherCmsModule,
    DataLakeModule,
    ParentDashboardModule,
    AiInterviewModule,
    ShadowingModeModule,
    CoachTimelineModule,
    LearningReplayModule,
    MarketplaceModule,
  ],
})
export class AppModule {}
