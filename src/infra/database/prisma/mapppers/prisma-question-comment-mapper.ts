import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaQuestionComment, Prisma } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(
    prismaQuestionComment: PrismaQuestionComment,
  ): QuestionComment {
    if (!prismaQuestionComment.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        questionId: new UniqueEntityId(prismaQuestionComment.questionId),
        authorId: new UniqueEntityId(prismaQuestionComment.authorId),
        content: prismaQuestionComment.content,
        createdAt: prismaQuestionComment.createdAt,
        updateAt: prismaQuestionComment.updateAt,
      },
      new UniqueEntityId(prismaQuestionComment.id),
    )
  }

  static toPrisma(
    answercomment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answercomment.id.toString(),
      authorId: answercomment.authorId.toString(),
      questionId: answercomment.questionId.toString(),
      content: answercomment.content,
      createdAt: answercomment.createdAt,
      updateAt: answercomment.updateAt,
    }
  }
}
