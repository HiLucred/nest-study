import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

export class AnswerWithAuthorPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHTTP(answerWithAuthor: AnswerWithAuthor) {
    return {
      authorId: answerWithAuthor.authorId.toString(),
      authorName: answerWithAuthor.author,
      questionId: answerWithAuthor.questionId.toString(),
      content: answerWithAuthor.content,
      createdAt: answerWithAuthor.createdAt,
      updateAt: answerWithAuthor.updateAt,
    }
  }
}
