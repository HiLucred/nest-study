import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    return Answer.create(
      {
        questionId: new UniqueEntityId(prismaAnswer.questionId),
        authorId: new UniqueEntityId(prismaAnswer.authorId),
        content: prismaAnswer.content,
        createdAt: prismaAnswer.createdAt,
        updateAt: prismaAnswer.updateAt,
      },
      new UniqueEntityId(prismaAnswer.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updateAt: answer.updateAt,
    }
  }
}
