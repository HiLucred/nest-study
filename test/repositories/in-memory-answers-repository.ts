import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answersAttachmentsRepository: AnswerAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answersAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    await this.answersAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )
    await this.answersAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex)

    this.answersAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findById(answerId: string) {
    const answer = this.items.find((item) => item.id.toString() === answerId)

    if (!answer) return null

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(answer.authorId),
        )

        if (!author) {
          throw new Error('Author not found.')
        }

        return AnswerWithAuthor.create({
          author: author.name,
          authorId: answer.authorId,
          content: answer.content,
          questionId: answer.questionId,
          createdAt: answer.createdAt,
          updateAt: answer.createdAt,
        })
      })

    return answers
  }
}
