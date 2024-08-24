import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAnswerAttachment } from '@prisma/client'

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

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}
