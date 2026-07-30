import { PlacementTestService } from './placement-test.service';
export declare class PlacementTestController {
    private placementTestService;
    constructor(placementTestService: PlacementTestService);
    generatePlacementTest(req: any): Promise<any>;
    submitPlacementTest(req: any, body: {
        grammar: string;
        listening: string;
        speaking: string;
        vocabulary: number;
        pronunciation: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date;
        pronunciationScore: number;
        overallScore: number;
        vocabularyScore: number;
        grammarScore: number;
        listeningScore: number;
        speakingScore: number;
        suggestedLevel: import("@prisma/client").$Enums.Level;
    }>;
    getPlacementTestResult(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date;
        pronunciationScore: number;
        overallScore: number;
        vocabularyScore: number;
        grammarScore: number;
        listeningScore: number;
        speakingScore: number;
        suggestedLevel: import("@prisma/client").$Enums.Level;
    }>;
    retakePlacementTest(req: any): Promise<any>;
}
