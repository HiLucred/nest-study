import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mapppers/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { PrismaQuestionDetailsMapper } from '../mapppers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private cache: CacheRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      await this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      await this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      await this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      await this.cache.delete(`question:${question.slug.value}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(questionSlug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug: questionSlug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(
    questionSlug: string,
  ): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${questionSlug}:details`)

    if (cacheHit) {
      const chachedData = JSON.parse(cacheHit)
      return PrismaQuestionDetailsMapper.toDomain(chachedData)
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug: questionSlug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    await this.cache.set(
      `question:${questionSlug}:details`,
      JSON.stringify(question),
    )

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    return questionDetails
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[] | null> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!questions) {
      return null
    }

    return questions.map((question) => PrismaQuestionMapper.toDomain(question))
  }
}
