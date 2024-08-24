import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
  ) {
    const { content } = body

    const result = await this.commentOnQuestion.execute({
      authorId: user.sub,
      questionId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
