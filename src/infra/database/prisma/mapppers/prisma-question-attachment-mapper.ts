import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaQuestionAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    prismaQuestionAttachment: PrismaQuestionAttachment,
  ): QuestionAttachment {
    if (!prismaQuestionAttachment.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityId(prismaQuestionAttachment.questionId),
        attachmentId: new UniqueEntityId(prismaQuestionAttachment.id),
      },
      new UniqueEntityId(prismaQuestionAttachment.id),
    )
  }
}
