import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch Question Answers (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    for (let i = 0; i < 2; i++) {
      await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'Answer content...',
      })
    }

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: [
        expect.objectContaining({
          content: 'Answer content...',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          content: 'Answer content...',
          authorName: 'John Doe',
        }),
      ],
    })
  })
})
