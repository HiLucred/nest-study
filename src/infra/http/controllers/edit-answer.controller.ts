import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()).default([]),
})

const editAnswerBodyPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(editAnswerBodyPipe) body: EditAnswerBodySchema,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub
    const { content, attachmentsIds } = body

    const result = await this.editAnswer.execute({
      content,
      answerId,
      attachmentsIds,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
