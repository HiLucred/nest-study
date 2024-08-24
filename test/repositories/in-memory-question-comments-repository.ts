import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentId = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(questionCommentId)
  }

  async deleteManyByQuestionId(questionId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === questionId,
    )

    this.items.splice(itemIndex)
  }

  async findById(questionCommentId: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === questionCommentId,
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author with ${comment.authorId.toString()}`)
        }

        return CommentWithAuthor.create({
          authorId: comment.authorId,
          content: comment.content,
          updatedAt: comment.updateAt,
          createdAt: comment.createdAt,
          author: author.name,
          commentId: comment.id,
        })
      })

    return questionComments
  }
}
