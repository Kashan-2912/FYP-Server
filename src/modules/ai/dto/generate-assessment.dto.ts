import { IsIn, IsNumber, IsString, Max, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  stack: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  selfRating: number;

  @IsString()
  @IsNotEmpty()
  priorKnowledge: string;

  @IsIn(['slow', 'medium', 'fast'])
  learningPace: 'slow' | 'medium' | 'fast';
}
