import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion, Prisma } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion): Question {
    return Question.create(
      {
        title: prismaQuestion.title,
        content: prismaQuestion.content,
        authorId: new UniqueEntityId(prismaQuestion.authorId),
        bestAnswerId: prismaQuestion.bestAnswerId
          ? new UniqueEntityId(prismaQuestion.bestAnswerId)
          : null,
        slug: Slug.create(prismaQuestion.slug),
        createdAt: prismaQuestion.createdAt,
        updateAt: prismaQuestion.updateAt,
      },
      new UniqueEntityId(prismaQuestion.id),
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updateAt: question.updateAt,
    }
  }
}
