import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaQuestionAttachment } from '@prisma/client'

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

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((questionAttachment) => {
      return questionAttachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    }
  }

  static toPrismaDeleteMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentIds = attachments.map((questionAttachment) => {
      return questionAttachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
    }
  }
}
