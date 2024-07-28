import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaAnswerComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(prismaAnswerComment: PrismaAnswerComment): AnswerComment {
    if (!prismaAnswerComment.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityId(prismaAnswerComment.answerId),
        authorId: new UniqueEntityId(prismaAnswerComment.authorId),
        content: prismaAnswerComment.content,
        createdAt: prismaAnswerComment.createdAt,
        updateAt: prismaAnswerComment.updateAt,
      },
      new UniqueEntityId(prismaAnswerComment.id),
    )
  }

  static toPrisma(
    answercomment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answercomment.id.toString(),
      authorId: answercomment.authorId.toString(),
      answerId: answercomment.answerId.toString(),
      content: answercomment.content,
      createdAt: answercomment.createdAt,
      updateAt: answercomment.updateAt,
    }
  }
}
