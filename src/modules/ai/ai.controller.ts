import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AssessmentService } from './services/assessment.service';
import { GenerateAssessmentDto } from './dto/generate-assessment.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('generate-assessment')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async generateAssessment(@Body() dto: GenerateAssessmentDto) {
    return this.assessmentService.generateAssessment(dto);
  }
}
