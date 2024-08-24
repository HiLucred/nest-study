import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller()
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post('/questions/:questionId/answers')
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    const { content, attachmentsIds } = body

    const result = await this.answerQuestion.execute({
      authorId: userId,
      questionId,
      content,
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
