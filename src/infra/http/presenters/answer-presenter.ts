import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updateAt: answer.updateAt,
    }
  }
}
