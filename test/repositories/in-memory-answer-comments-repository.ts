import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(answerCommentIndex)
  }

  async findById(answerCommentId: string) {
    const answerComment = this.items.find(
      (item) => item.id.toString() === answerCommentId,
    )

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author) {
          throw new Error(`Author with ${comment.authorId.toString()}`)
        }

        return CommentWithAuthor.create({
          author: author.name,
          authorId: author.id,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updateAt,
        })
      })

    return answerComments
  }
}
