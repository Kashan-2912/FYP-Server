import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AssessmentService } from './services/assessment.service';
import { GroqProvider } from './providers/groq.provider';

@Module({
  controllers: [AiController],
  providers: [
    {
      provide: 'AI_PROVIDER',
      useClass: GroqProvider,
    },
    AssessmentService,
  ],
  exports: [AssessmentService],
})
export class AiModule {}
