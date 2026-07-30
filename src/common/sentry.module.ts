import { Module } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { ConfigService } from '@nestjs/config';

@Module({})
export class SentryModule {
  static forRoot() {
    return {
      module: SentryModule,
      providers: [
        {
          provide: 'SENTRY_INIT',
          useFactory: (configService: ConfigService) => {
            const dsn = configService.get<string>('SENTRY_DSN');
            
            if (dsn && dsn !== 'your-sentry-dsn') {
              Sentry.init({
                dsn,
                integrations: [
                  nodeProfilingIntegration(),
                ],
                tracesSampleRate: 1.0,
                profilesSampleRate: 1.0,
                environment: configService.get<string>('NODE_ENV') || 'development',
              });
              
              console.log('Sentry initialized');
            } else {
              console.log('Sentry not initialized - DSN not provided');
            }
          },
          inject: [ConfigService],
        },
      ],
      global: true,
    };
  }
}
