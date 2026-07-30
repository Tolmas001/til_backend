import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SentryModule } from './common/sentry.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  // Initialize Sentry
  SentryModule.forRoot();
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Russian Learning Platform API')
    .setDescription('AI-powered Russian language learning platform with 28+ AI modules')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('lessons', 'Lesson content and progress')
    .addTag('chat', 'AI chat functionality')
    .addTag('gamification', 'XP, achievements, and rewards')
    .addTag('ai-learning', 'AI Learning Engine')
    .addTag('certification', 'CEFR certification')
    .addTag('speech-analytics', 'Pronunciation analysis')
    .addTag('scenario', 'Real scenario simulation')
    .addTag('ai-mentor', 'AI Mentor coaching')
    .addTag('study-planner', 'AI Study Planner')
    .addTag('memory', 'Memory and mistake tracking')
    .addTag('daily-mission', 'Daily missions')
    .addTag('evaluation', 'AI Evaluation Engine')
    .addTag('adaptive-difficulty', 'Adaptive difficulty')
    .addTag('churn-prediction', 'Churn risk prediction')
    .addTag('placement-test', 'Placement test')
    .addTag('content-pipeline', 'AI Content Pipeline')
    .addTag('lesson-studio', 'AI Lesson Studio')
    .addTag('teacher-cms', 'Teacher CMS')
    .addTag('data-lake', 'Learning Data Lake')
    .addTag('parent-dashboard', 'Parent/Employer Dashboard')
    .addTag('ai-interview', 'AI Interview HR Simulation')
    .addTag('shadowing-mode', 'Shadowing Mode')
    .addTag('coach-timeline', 'AI Coach Timeline')
    .addTag('learning-replay', 'Learning Replay')
    .addTag('marketplace', 'Teacher Marketplace')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
