import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findById(questionId: string): Promise<Question | null>
  abstract findBySlug(questionSlug: string): Promise<Question | null>
  abstract findDetailsBySlug(
    questionSlug: string,
  ): Promise<QuestionDetails | null>

  abstract findManyRecent({
    page,
  }: PaginationParams): Promise<Question[] | null>
}
