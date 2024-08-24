import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from '@prisma/client'

type PrismaQuestionDetailsProps = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(
    questionDetails: PrismaQuestionDetailsProps,
  ): QuestionDetails {
    const attachments = questionDetails.attachments.map((attachment) => {
      return Attachment.create({ title: attachment.title, url: attachment.url })
    })

    return QuestionDetails.create({
      title: questionDetails.title,
      questionId: new UniqueEntityId(questionDetails.id),
      slug: Slug.create(questionDetails.slug),
      content: questionDetails.content,
      author: questionDetails.author.name,
      authorId: new UniqueEntityId(questionDetails.authorId),
      attachments,
      bestAnswerId:
        questionDetails.bestAnswerId !== null
          ? new UniqueEntityId(questionDetails.bestAnswerId)
          : null,
      createdAt: questionDetails.createdAt,
      updateAt: questionDetails.updateAt ?? null,
    })
  }
}
