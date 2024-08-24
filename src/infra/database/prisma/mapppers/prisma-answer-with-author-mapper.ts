import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'
import { Answer as PrismaAnswer, User as PrismaUser } from '@prisma/client'

type PrismaAnswerWithAuthor = PrismaAnswer & {
  author: PrismaUser
}

export class PrismaAnswerWithAuthorMapper {
  static toDomain(
    prismaAnswerWithAuthor: PrismaAnswerWithAuthor,
  ): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      author: prismaAnswerWithAuthor.author.name,
      authorId: new UniqueEntityId(prismaAnswerWithAuthor.authorId),
      content: prismaAnswerWithAuthor.content,
      questionId: new UniqueEntityId(prismaAnswerWithAuthor.questionId),
      createdAt: prismaAnswerWithAuthor.createdAt,
      updateAt: prismaAnswerWithAuthor.updateAt,
    })
  }
}
