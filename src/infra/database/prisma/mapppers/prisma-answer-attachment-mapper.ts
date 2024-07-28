import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAnswerAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(
    prismaQuestionAttachment: PrismaAnswerAttachment,
  ): AnswerAttachment {
    if (!prismaQuestionAttachment.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(prismaQuestionAttachment.answerId),
        attachmentId: new UniqueEntityId(prismaQuestionAttachment.id),
      },
      new UniqueEntityId(prismaQuestionAttachment.id),
    )
  }
}
