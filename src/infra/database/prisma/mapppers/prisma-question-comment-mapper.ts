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
        content: prismaQuestionComment.content,
        authorId: new UniqueEntityId(prismaQuestionComment.authorId),
        questionId: new UniqueEntityId(prismaQuestionComment.questionId),
        createdAt: prismaQuestionComment.createdAt,
        updateAt: prismaQuestionComment.updateAt,
      },
      new UniqueEntityId(prismaQuestionComment.id),
    )
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updateAt: questionComment.updateAt,
    }
  }
}
