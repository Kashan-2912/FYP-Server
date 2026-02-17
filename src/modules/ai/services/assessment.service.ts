import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AiProvider } from '../providers/ai-provider.interface';
import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';
import { buildAssessmentPrompt } from '../builders/prompt.builder';

export interface McqItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface CodingItem {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssessmentResponse {
  mcqs: McqItem[];
  coding: CodingItem[];
}

@Injectable()
export class AssessmentService {
  constructor(
    @Inject('AI_PROVIDER')
    private readonly aiProvider: AiProvider,
  ) {}

  async generateAssessment(
    dto: GenerateAssessmentDto,
  ): Promise<AssessmentResponse> {
    const prompt = buildAssessmentPrompt(dto);
    const rawResponse = await this.aiProvider.generateContent(prompt);
    const parsed = this.parseAndValidate(rawResponse);
    return parsed;
  }

  private parseAndValidate(raw: string): AssessmentResponse {
    let parsed: AssessmentResponse;
    
    try {
      parsed = JSON.parse(raw) as AssessmentResponse;
    } catch {
      throw new HttpException(
        'AI response is not valid JSON',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (
      !Array.isArray(parsed.mcqs) ||
      !Array.isArray(parsed.coding)
    ) {
      throw new HttpException(
        'AI response is missing required fields: mcqs or coding',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (const mcq of parsed.mcqs) {
      if (
        typeof mcq.question !== 'string' ||
        !Array.isArray(mcq.options) ||
        mcq.options.length !== 4 ||
        typeof mcq.correctAnswerIndex !== 'number'
      ) {
        throw new HttpException(
          'Invalid MCQ structure in AI response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }


    for (const item of parsed.coding) {
      if (
        typeof item.question !== 'string' ||
        !['easy', 'medium', 'hard'].includes(item.difficulty)
      ) {
        throw new HttpException(
          'Invalid coding question structure in AI response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return parsed;
  }
}
