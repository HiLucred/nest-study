import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )
    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    )

    if (!question) return null

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    return question
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const student = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!student) {
      throw new Error('Author not found.')
    }

    const questionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(
        question.id.toString(),
      )

    const attachments = questionAttachments.map((attachmentId) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(attachmentId.attachmentId),
      )

      if (!attachment) {
        throw new Error(
          `Attachment with id "${attachmentId.id.toString()}" does not exist.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      author: student.name,
      authorId: question.authorId,
      content: question.content,
      slug: question.slug,
      title: question.title,
      bestAnswerId: question.bestAnswerId ? question.bestAnswerId : null,
      createdAt: question.createdAt,
      updateAt: question.updateAt ?? undefined,
      attachments,
      questionId: question.id,
    })
  }

  async findManyRecent({ page }: PaginationParams) {
    const latestQuestions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return latestQuestions
  }
}
