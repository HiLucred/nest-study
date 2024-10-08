import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract createMany(questionAttachment: AnswerAttachment[]): Promise<void>
  abstract deleteMany(questionAttachment: AnswerAttachment[]): Promise<void>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
}
