import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { PrismaQuestionsRepository } from './prisma-questions-repository'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

describe('Prisma question repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionsRepository: PrismaQuestionsRepository
  let cacheRepository: CacheRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionsRepository = moduleRef.get(QuestionsRepository)
    cacheRepository = moduleRef.get(CacheRepository)

    await app.init()
  })

  test('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionDetails = await questionsRepository.findDetailsBySlug(
      question.slug.value,
    )

    const cached = await cacheRepository.get(
      `question:${question.slug.value}:details`,
    )

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const slug = question.slug.value

    let cached = await cacheRepository.get(`question:${slug}:details`)
    expect(cached).toBeNull()

    await questionsRepository.findDetailsBySlug(slug)

    cached = await cacheRepository.get(`question:${slug}:details`)
    expect(cached).not.toBeNull()

    if (!cached) {
      throw new Error()
    }

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionsRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
