"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ShadowingModeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowingModeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ShadowingModeService = ShadowingModeService_1 = class ShadowingModeService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(ShadowingModeService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async createShadowingSession(userId, level, topic) {
        if (!this.openai) {
            return this.createFallbackShadowingSession(level, topic);
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Generate a shadowing exercise for Russian language practice.
Level: ${level}
Topic: ${topic || 'general'}

Return JSON format:
{
  "session": {
    "title": "Shadowing exercise title",
    "description": "Exercise description",
    "level": "${level}",
    "topic": "${topic || 'general'}",
    "duration": "5 minutes"
  },
  "phrases": [
    {
      "id": 1,
      "russian": "Russian phrase",
      "translation": "Uzbek translation",
      "pronunciation": "pronunciation guide",
      "tips": "Tips for pronunciation"
    }
  ],
  "dialog": {
    "title": "Dialog title",
    "lines": [
      {
        "speaker": "Person A",
        "russian": "Russian text",
        "translation": "Uzbek translation"
      }
    ]
  }
}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            const session = await this.prisma.shadowingSession.create({
                data: {
                    userId,
                    level: level,
                    topic: topic || 'general',
                    phrases: parsed.phrases,
                    dialog: parsed.dialog,
                    status: 'pending',
                    createdAt: new Date(),
                },
            });
            return session;
        }
        catch (err) {
            this.logger.error('AI shadowing session generation failed, using fallback', err.message);
            return this.createFallbackShadowingSession(level, topic);
        }
    }
    async createFallbackShadowingSession(level, topic) {
        const fallbackPhrases = [
            {
                id: 1,
                russian: 'Здравствуйте',
                translation: 'Salom',
                pronunciation: 'Zdravstvuyte',
                tips: 'Zdravstvuyte - rasmiy salomlashish',
            },
            {
                id: 2,
                russian: 'Как дела?',
                translation: 'Qalay?',
                pronunciation: 'Kak dela?',
                tips: 'Kak dela - hol-ahvol so\'rash',
            },
            {
                id: 3,
                russian: 'Спасибо',
                translation: 'Rahmat',
                pronunciation: 'Spasibo',
                tips: 'Spasibo - rahmat aytish',
            },
        ];
        const fallbackDialog = {
            title: 'Tanishuv',
            lines: [
                {
                    speaker: 'Person A',
                    russian: 'Здравствуйте, меня зовут Али',
                    translation: 'Salom, mening ismim Ali',
                },
                {
                    speaker: 'Person B',
                    russian: 'Привет, приятно познакомиться',
                    translation: 'Salom, tanishganimdan xursandman',
                },
            ],
        };
        const session = await this.prisma.shadowingSession.create({
            data: {
                userId: 'system',
                level: level,
                topic: topic || 'general',
                phrases: fallbackPhrases,
                dialog: fallbackDialog,
                status: 'pending',
                createdAt: new Date(),
            },
        });
        return session;
    }
    async submitRecording(userId, sessionId, phraseId, audioUrl) {
        const session = await this.prisma.shadowingSession.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new Error('Session not found');
        }
        let comparison = null;
        if (this.openai) {
            try {
                const phrase = session.phrases.find((p) => p.id === phraseId);
                if (phrase) {
                    const response = await this.openai.chat.completions.create({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: `Evaluate the pronunciation of a Russian phrase.
Original phrase: ${phrase.russian}
Audio recording provided

Return JSON format:
{
  "score": 85,
  "feedback": "Good pronunciation, but work on stress",
  "accuracy": 0.8,
  "fluency": 0.85,
  "intonation": 0.75,
  "improvements": ["improve stress on first syllable"]
}`,
                            },
                        ],
                        response_format: { type: 'json_object' },
                    });
                    comparison = JSON.parse(response.choices[0].message.content || '{}');
                }
            }
            catch (err) {
                this.logger.error('AI pronunciation evaluation failed', err.message);
            }
        }
        const recording = {
            phraseId,
            audioUrl,
            comparison,
            submittedAt: new Date(),
        };
        const updatedRecordings = [...(session.recordings || []), recording];
        await this.prisma.shadowingSession.update({
            where: { id: sessionId },
            data: {
                recordings: updatedRecordings,
                status: 'in_progress',
            },
        });
        return recording;
    }
    async completeSession(userId, sessionId) {
        const session = await this.prisma.shadowingSession.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new Error('Session not found');
        }
        let totalScore = 0;
        let totalWeight = 0;
        if (session.recordings && session.recordings.length > 0) {
            session.recordings.forEach((recording) => {
                if (recording.comparison && recording.comparison.score) {
                    totalScore += recording.comparison.score;
                    totalWeight += 1;
                }
            });
        }
        const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
        const updatedSession = await this.prisma.shadowingSession.update({
            where: { id: sessionId },
            data: {
                status: 'completed',
                overallScore,
                completedAt: new Date(),
            },
        });
        return updatedSession;
    }
    async getSession(sessionId) {
        return this.prisma.shadowingSession.findUnique({
            where: { id: sessionId },
        });
    }
    async getUserSessions(userId, limit = 20) {
        return this.prisma.shadowingSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getSessionStats() {
        const sessions = await this.prisma.shadowingSession.findMany();
        const total = sessions.length;
        const completed = sessions.filter((s) => s.status === 'completed').length;
        const pending = sessions.filter((s) => s.status === 'pending').length;
        const inProgress = sessions.filter((s) => s.status === 'in_progress').length;
        const topicStats = {};
        sessions.forEach((s) => {
            topicStats[s.topic] = (topicStats[s.topic] || 0) + 1;
        });
        const avgScore = completed > 0
            ? Math.round(sessions
                .filter((s) => s.overallScore !== null)
                .reduce((sum, s) => sum + (s.overallScore || 0), 0) /
                sessions.filter((s) => s.overallScore !== null).length)
            : 0;
        return {
            total,
            completed,
            pending,
            inProgress,
            topicStats,
            averageScore: avgScore,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    }
};
exports.ShadowingModeService = ShadowingModeService;
exports.ShadowingModeService = ShadowingModeService = ShadowingModeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ShadowingModeService);
//# sourceMappingURL=shadowing-mode.service.js.map