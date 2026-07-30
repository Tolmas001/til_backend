"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const lessons_module_1 = require("./lessons/lessons.module");
const chat_module_1 = require("./chat/chat.module");
const progress_module_1 = require("./progress/progress.module");
const gamification_module_1 = require("./gamification/gamification.module");
const ai_learning_module_1 = require("./ai-learning/ai-learning.module");
const certification_module_1 = require("./certification/certification.module");
const speech_analytics_module_1 = require("./speech-analytics/speech-analytics.module");
const scenario_module_1 = require("./scenario/scenario.module");
const ai_mentor_module_1 = require("./ai-mentor/ai-mentor.module");
const study_planner_module_1 = require("./study-planner/study-planner.module");
const memory_module_1 = require("./memory/memory.module");
const daily_mission_module_1 = require("./daily-mission/daily-mission.module");
const evaluation_module_1 = require("./evaluation/evaluation.module");
const adaptive_difficulty_module_1 = require("./adaptive-difficulty/adaptive-difficulty.module");
const churn_prediction_module_1 = require("./churn-prediction/churn-prediction.module");
const placement_test_module_1 = require("./placement-test/placement-test.module");
const content_pipeline_module_1 = require("./content-pipeline/content-pipeline.module");
const lesson_studio_module_1 = require("./lesson-studio/lesson-studio.module");
const teacher_cms_module_1 = require("./teacher-cms/teacher-cms.module");
const data_lake_module_1 = require("./data-lake/data-lake.module");
const parent_dashboard_module_1 = require("./parent-dashboard/parent-dashboard.module");
const ai_interview_module_1 = require("./ai-interview/ai-interview.module");
const shadowing_mode_module_1 = require("./shadowing-mode/shadowing-mode.module");
const coach_timeline_module_1 = require("./coach-timeline/coach-timeline.module");
const learning_replay_module_1 = require("./learning-replay/learning-replay.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            lessons_module_1.LessonsModule,
            chat_module_1.ChatModule,
            progress_module_1.ProgressModule,
            gamification_module_1.GamificationModule,
            ai_learning_module_1.AiLearningModule,
            certification_module_1.CertificationModule,
            speech_analytics_module_1.SpeechAnalyticsModule,
            scenario_module_1.ScenarioModule,
            ai_mentor_module_1.AiMentorModule,
            study_planner_module_1.StudyPlannerModule,
            memory_module_1.MemoryModule,
            daily_mission_module_1.DailyMissionModule,
            evaluation_module_1.EvaluationModule,
            adaptive_difficulty_module_1.AdaptiveDifficultyModule,
            churn_prediction_module_1.ChurnPredictionModule,
            placement_test_module_1.PlacementTestModule,
            content_pipeline_module_1.ContentPipelineModule,
            lesson_studio_module_1.LessonStudioModule,
            teacher_cms_module_1.TeacherCmsModule,
            data_lake_module_1.DataLakeModule,
            parent_dashboard_module_1.ParentDashboardModule,
            ai_interview_module_1.AiInterviewModule,
            shadowing_mode_module_1.ShadowingModeModule,
            coach_timeline_module_1.CoachTimelineModule,
            learning_replay_module_1.LearningReplayModule,
            marketplace_module_1.MarketplaceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map