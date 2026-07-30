import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class SpeechAnalyticsService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(SpeechAnalyticsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Speech Analytics - Detailed Pronunciation Analysis
  async analyzeSpeech(userId: string, audioUrl: string, transcript: string) {
    if (!this.openai) {
      return this.generateFallbackAnalysis(transcript);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Russian language pronunciation expert. Analyze the speech transcript.
Return JSON format:
{
  "pronunciationScore": 85,
  "fluencyScore": 75,
  "intonationScore": 80,
  "stressScore": 70,
  "pauseScore": 85,
  "overallScore": 79,
  "feedback": {
    "strengths": ["Good word choice", "Clear pronunciation of vowels"],
    "weaknesses": ["Stress on wrong syllables", "Too many pauses"],
    "improvements": ["Practice stress patterns", "Reduce pause frequency"],
    "specificErrors": [
      {
        "word": "Здравствуйте",
        "issue": "Stress on wrong syllable",
        "correction": "Zdra-vst-vuy-te"
      }
    ]
  }
}`,
          },
          {
            role: 'user',
            content: `Transcript: "${transcript}"`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      // Save speech record
      const speechRecord = await this.prisma.speechRecord.create({
        data: {
          userId,
          audioUrl,
          transcript,
          pronunciationScore: parsed.pronunciationScore || 0,
          fluencyScore: parsed.fluencyScore || 0,
          intonationScore: parsed.intonationScore || 0,
          stressScore: parsed.stressScore || 0,
          pauseScore: parsed.pauseScore || 0,
          overallScore: parsed.overallScore || 0,
          feedback: parsed.feedback || {},
        },
      });

      return {
        speechRecord,
        analysis: parsed,
      };
    } catch (err) {
      this.logger.error('AI speech analysis failed, using fallback', err.message);
      return this.generateFallbackAnalysis(transcript);
    }
  }

  private generateFallbackAnalysis(transcript: string) {
    const wordCount = transcript.split(' ').length;
    const overallScore = Math.min(95, 60 + wordCount * 2);

    const analysis = {
      pronunciationScore: overallScore - 5,
      fluencyScore: overallScore - 10,
      intonationScore: overallScore - 5,
      stressScore: overallScore - 15,
      pauseScore: overallScore,
      overallScore,
      feedback: {
        strengths: ['Good effort', 'Clear attempt'],
        weaknesses: ['Needs more practice', 'Work on stress patterns'],
        improvements: ['Practice daily', 'Listen to native speakers'],
        specificErrors: [],
      },
    };

    return {
      analysis,
      speechRecord: null,
    };
  }

  async getUserSpeechHistory(userId: string, limit: number = 20) {
    return this.prisma.speechRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getWeeklySpeechReport(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const records = await this.prisma.speechRecord.findMany({
      where: {
        userId,
        createdAt: { gte: weekAgo },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (records.length === 0) {
      return {
        message: 'No speech records this week',
        records: [],
      };
    }

    const avgPronunciation = records.reduce((sum, r) => sum + r.pronunciationScore, 0) / records.length;
    const avgFluency = records.reduce((sum, r) => sum + r.fluencyScore, 0) / records.length;
    const avgIntonation = records.reduce((sum, r) => sum + r.intonationScore, 0) / records.length;
    const avgStress = records.reduce((sum, r) => sum + r.stressScore, 0) / records.length;
    const avgPause = records.reduce((sum, r) => sum + r.pauseScore, 0) / records.length;
    const avgOverall = records.reduce((sum, r) => sum + r.overallScore, 0) / records.length;

    // Calculate improvement
    const firstHalf = records.slice(0, Math.floor(records.length / 2));
    const secondHalf = records.slice(Math.floor(records.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, r) => sum + r.overallScore, 0) / (firstHalf.length || 1);
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.overallScore, 0) / (secondHalf.length || 1);
    const improvement = secondAvg - firstAvg;

    // Identify common issues
    const commonWeaknesses: string[] = [];
    if (avgStress < 70) commonWeaknesses.push('Stress patterns');
    if (avgPause < 70) commonWeaknesses.push('Pausing');
    if (avgIntonation < 70) commonWeaknesses.push('Intonation');
    if (avgFluency < 70) commonWeaknesses.push('Fluency');

    return {
      records,
      averages: {
        pronunciation: Math.round(avgPronunciation),
        fluency: Math.round(avgFluency),
        intonation: Math.round(avgIntonation),
        stress: Math.round(avgStress),
        pause: Math.round(avgPause),
        overall: Math.round(avgOverall),
      },
      improvement: Math.round(improvement),
      commonWeaknesses,
      recommendations: this.generateSpeechRecommendations(commonWeaknesses),
    };
  }

  private generateSpeechRecommendations(weaknesses: string[]): string[] {
    const recommendations: string[] = [];

    if (weaknesses.includes('Stress patterns')) {
      recommendations.push('Practice Russian stress patterns with audio examples');
      recommendations.push('Focus on multi-syllable words');
    }

    if (weaknesses.includes('Pausing')) {
      recommendations.push('Practice speaking at a steady pace');
      recommendations.push('Listen to native speakers\' rhythm');
    }

    if (weaknesses.includes('Intonation')) {
      recommendations.push('Practice question vs statement intonation');
      recommendations.push('Record and compare with native speakers');
    }

    if (weaknesses.includes('Fluency')) {
      recommendations.push('Practice common phrases until automatic');
      recommendations.push('Reduce hesitation with filler words');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue practicing to maintain your level');
      recommendations.push('Try more complex sentences');
    }

    return recommendations;
  }

  async compareWithNative(userId: string, userTranscript: string, nativeTranscript: string) {
    if (!this.openai) {
      return this.generateFallbackComparison(userTranscript, nativeTranscript);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Compare the user's Russian speech with native Russian.
Return JSON format:
{
  "similarityScore": 85,
  "differences": [
    {
      "type": "pronunciation",
      "user": "Zdravstvuyte",
      "native": "Zdravstvuyte",
      "note": "User pronounced correctly"
    }
  ],
  "overallFeedback": "Good pronunciation, work on stress"
}`,
          },
          {
            role: 'user',
            content: `User: "${userTranscript}"\nNative: "${nativeTranscript}"`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return parsed;
    } catch (err) {
      this.logger.error('AI comparison failed, using fallback', err.message);
      return this.generateFallbackComparison(userTranscript, nativeTranscript);
    }
  }

  private generateFallbackComparison(userTranscript: string, nativeTranscript: string) {
    const similarity = userTranscript === nativeTranscript ? 100 : 70;
    
    return {
      similarityScore: similarity,
      differences: [
        {
          type: 'general',
          note: 'Basic comparison - AI analysis not available',
        },
      ],
      overallFeedback: similarity > 80 ? 'Excellent match!' : 'Keep practicing',
    };
  }
}
