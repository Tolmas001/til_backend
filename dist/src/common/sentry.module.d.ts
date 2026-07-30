import { ConfigService } from '@nestjs/config';
export declare class SentryModule {
    static forRoot(): {
        module: typeof SentryModule;
        providers: {
            provide: string;
            useFactory: (configService: ConfigService) => void;
            inject: (typeof ConfigService)[];
        }[];
        global: boolean;
    };
}
