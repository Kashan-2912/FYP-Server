import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';

export function buildAssessmentPrompt(data: GenerateAssessmentDto): string {
  const includeCoding = data.selfRating >= 6;

  const codingInstruction = includeCoding
    ? `- Exactly 2 coding questions with difficulty levels (easy, medium, or hard).
       - Each coding question MUST include 2 to 4 test cases.
       - Each test case must include:
         - "input": string (clearly formatted input)
         - "expectedOutput": string
       - If the self-rating seems overestimated based on prior knowledge, adjust difficulty accordingly.`
    : `- No coding questions (self-rating is below 6).`;

  return `You are an expert technical interviewer specializing in ${data.stack} development using ${data.language}.

A candidate has provided the following self-assessment:
- Technology Stack: ${data.stack}
- Programming Language: ${data.language}
- Self-Rated Skill Level: ${data.selfRating}/10
- Prior Knowledge: ${data.priorKnowledge}
- Learning Pace: ${data.learningPace}

Based on this information, generate a technical assessment. Carefully analyze whether the candidate's self-rating of ${data.selfRating}/10 might be overestimated given their described prior knowledge. If overestimation is detected, adjust question difficulty to probe actual skill level.

Generate the following:
- Between 5 and 10 multiple choice questions (MCQs), each with:
  - exactly 4 options
  - one correct answer index (0-based)
${codingInstruction}

You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no explanation, no extra text before or after the JSON.

The JSON must follow this exact structure:

{
  "mcqs": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswerIndex": 0
    }
  ],
  "coding": [
    {
      "question": "string",
      "difficulty": "easy | medium | hard",
      "testCases": [
        {
          "input": "string",
          "expectedOutput": "string"
        }
      ]
    }
  ]
}

If no coding questions are required, the "coding" array must be an empty array [].

Return ONLY the JSON object. Nothing else.`;
}
