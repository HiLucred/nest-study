import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract createMany(questionAttachment: QuestionAttachment[]): Promise<void>
  abstract deleteMany(questionAttachment: QuestionAttachment[]): Promise<void>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>
}
