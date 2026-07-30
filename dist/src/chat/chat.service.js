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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ChatService = ChatService_1 = class ChatService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(ChatService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async getUserChats(userId) {
        return this.prisma.chat.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 50,
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async getChat(chatId, userId) {
        return this.prisma.chat.findFirst({
            where: { id: chatId, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
    async createChat(userId, title = 'Suhbat', aiCharacter = 'Анна') {
        return this.prisma.chat.create({
            data: {
                userId,
                title,
                aiCharacter,
            },
        });
    }
    async sendMessage(userId, chatId, content) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const userLevel = user?.level || 'A0';
        const userMsg = await this.prisma.chatMessage.create({
            data: {
                chatId,
                userId,
                role: 'user',
                content,
            },
        });
        let aiResponseText = '';
        let corrections = null;
        if (this.openai) {
            try {
                const response = await this.openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: `Ты — дружелюбный репетитор русского языка для узбекоязычных студентов. 
Уровень студента: ${userLevel}. 
Отвечай коротко (2-3 предложения), поддерживай диалог на русском языке.
Также проанализируй текст студента на наличие грамматических ошибок.
Формат ответа обязательно должен быть JSON:
{
  "reply": "Твой ответ на русском языке",
  "corrections": {
    "hasErrors": true/false,
    "original": "текст студента",
    "corrected": "исправленный вариант",
    "explanation": "Объяснение ошибки на узбекском или русском языке"
  }
}`,
                        },
                        {
                            role: 'user',
                            content,
                        },
                    ],
                    response_format: { type: 'json_object' },
                });
                const parsed = JSON.parse(response.choices[0].message.content || '{}');
                aiResponseText = parsed.reply || 'Привет! Отлично сказано.';
                corrections = parsed.corrections || null;
            }
            catch (err) {
                this.logger.error('OpenAI call failed, falling back to rule-based AI:', err.message);
                aiResponseText = this.generateFallbackResponse(content, userLevel);
                corrections = this.generateFallbackCorrections(content);
            }
        }
        else {
            aiResponseText = this.generateFallbackResponse(content, userLevel);
            corrections = this.generateFallbackCorrections(content);
        }
        const aiMsg = await this.prisma.chatMessage.create({
            data: {
                chatId,
                userId,
                role: 'assistant',
                content: aiResponseText,
                corrections: corrections ? JSON.stringify(corrections) : null,
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: 5 },
                coins: { increment: 2 },
            },
        });
        return {
            userMessage: userMsg,
            aiMessage: aiMsg,
            corrections,
        };
    }
    generateFallbackResponse(userText, level) {
        const textLower = userText.toLowerCase();
        if (textLower.includes('привет') || textLower.includes('salom')) {
            return 'Привет! Как твои дела сегодня? Готов попрактиковать русский язык?';
        }
        if (textLower.includes('как дела') || textLower.includes('qalay')) {
            return 'У меня всё отлично! Спасибо. Чем ты сегодня занимался?';
        }
        if (textLower.includes('меня зовут') || textLower.includes('ismim')) {
            return 'Очень приятно познакомиться! Я твой AI репетитор. О чём мы поговорим?';
        }
        return `Отлично! Вы сказали: "${userText}". Молодец! Давай продолжим диалог.`;
    }
    generateFallbackCorrections(userText) {
        if (userText.toLowerCase().includes('mening ismim')) {
            return {
                hasErrors: true,
                original: userText,
                corrected: 'Меня зовут ...',
                explanation: 'Rus tilida "mening ismim" o\'rniga "Меня зовут" deb aytiladi.',
            };
        }
        return {
            hasErrors: false,
            original: userText,
            corrected: userText,
            explanation: 'Grammatik xatolar topilmadi, barakalla!',
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map