import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class PlacementTestService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(PlacementTestService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Placement Test - Initial Skill Assessment
  async generatePlacementTest(userId: string) {
    if (!this.openai) {
      return this.generateFallbackPlacementTest();
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate a 10-minute Russian language placement test.
The test should assess: Grammar, Listening, Speaking, Vocabulary, Pronunciation.

Return JSON format:
{
  "grammar": {
    "question": "Grammar question in Russian",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "Explanation in Uzbek"
  },
  "listening": {
    "transcript": "Russian text for listening",
    "question": "Question about the text",
    "options": ["A", "B", "C", "D"],
    "correct": "B"
  },
  "speaking": {
    "prompt": "Speaking prompt in Russian",
    "expectedResponse": "Expected response"
  },
  "vocabulary": {
    "words": [
      {"word": "слово", "translation": "translation"},
      {"word": "слово2", "translation": "translation2"}
    ]
  },
  "pronunciation": {
    "phrase": "Phrase to pronounce",
    "transcription": "transcription"
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return parsed;
    } catch (err) {
      this.logger.error('AI placement test generation failed, using fallback', err.message);
      return this.generateFallbackPlacementTest();
    }
  }

  private generateFallbackPlacementTest() {
    return {
      grammar: {
        question: 'Я _____ книгу.',
        options: ['читаю', 'читать', 'читал', 'чтение'],
        correct: 'читаю',
        explanation: 'Men kitob o\'qiyman. Hozirgi zamon fe\'l.',
      },
      listening: {
        transcript: 'Меня зовут Анна. Я из Москвы.',
        question: 'Qayerdan kelgan?',
        options: ['Ташкент', 'Москва', 'Санкт-Петербург', 'Киев'],
        correct: 'Москва',
      },
      speaking: {
        prompt: 'O\'zingiz haqingizda gapiring.',
        expectedResponse: 'Меня зовут...',
      },
      vocabulary: {
        words: [
          { word: 'книга', translation: 'kitob' },
          { word: 'стол', translation: 'stol' },
          { word: 'дом', translation: 'uy' },
          { word: 'вода', translation: 'suv' },
          { word: 'друг', translation: 'do\'st' },
        ],
      },
      pronunciation: {
        phrase: 'Здравствуйте',
        transcription: 'Zdravstvuyte',
      },
    };
  }

  async submitPlacementTest(
    userId: string,
    answers: {
      grammar: string;
      listening: string;
      speaking: string;
      vocabulary: number;
      pronunciation: number;
    },
  ) {
    // Calculate scores
    const grammarScore = this.calculateGrammarScore(answers.grammar);
    const listeningScore = this.calculateListeningScore(answers.listening);
    const speakingScore = this.calculateSpeakingScore(answers.speaking);
    const vocabularyScore = answers.vocabulary;
    const pronunciationScore = answers.pronunciation;

    const overallScore = Math.round(
      (grammarScore + listeningScore + speakingScore + vocabularyScore + pronunciationScore) / 5,
    );

    // Determine suggested level
    const suggestedLevel = this.determineLevel(overallScore);

    // Save placement test result
    const existing = await this.prisma.placementTest.findUnique({
      where: { userId },
    });

    if (existing) {
      const updated = await this.prisma.placementTest.update({
        where: { userId },
        data: {
          grammarScore,
          listeningScore,
          speakingScore,
          vocabularyScore,
          pronunciationScore,
          overallScore,
          suggestedLevel: suggestedLevel as any,
          completedAt: new Date(),
        },
      });

      // Update user level
      await this.prisma.user.update({
        where: { id: userId },
        data: { level: suggestedLevel as any },
      });

      return updated;
    }

    const placementTest = await this.prisma.placementTest.create({
      data: {
        userId,
        grammarScore,
        listeningScore,
        speakingScore,
        vocabularyScore,
        pronunciationScore,
        overallScore,
        suggestedLevel: suggestedLevel as any,
        completedAt: new Date(),
      },
    });

    // Update user level
    await this.prisma.user.update({
      where: { id: userId },
      data: { level: suggestedLevel as any },
    });

    return placementTest;
  }

  private calculateGrammarScore(answer: string): number {
    // Simple scoring - in production, use AI to evaluate
    const correctAnswers = ['читаю', 'читал', 'читают'];
    if (correctAnswers.includes(answer)) {
      return 85;
    }
    return 60;
  }

  private calculateListeningScore(answer: string): number {
    const correctAnswers = ['Москва', 'Москве'];
    if (correctAnswers.includes(answer)) {
      return 90;
    }
    return 55;
  }

  private calculateSpeakingScore(answer: string): number {
    const wordCount = answer.split(' ').length;
    if (wordCount >= 5) {
      return 80;
    }
    return 50;
  }

  private determineLevel(score: number): string {
    if (score >= 90) return 'B2';
    if (score >= 80) return 'B1';
    if (score >= 70) return 'A2';
    if (score >= 60) return 'A1';
    return 'A0';
  }

  async getPlacementTestResult(userId: string) {
    return this.prisma.placementTest.findUnique({
      where: { userId },
    });
  }

  async retakePlacementTest(userId: string) {
    // Delete existing test
    await this.prisma.placementTest.delete({
      where: { userId },
    });

    // Generate new test
    return this.generatePlacementTest(userId);
  }
}
