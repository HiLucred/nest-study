import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

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
}
