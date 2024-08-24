import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import request from 'supertest'
import { waitFor } from 'test/utils/wait-for'
import { PrismaService } from '../database/prisma/prisma.service'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DomainEvents } from '@/core/events/domain-events'

describe('On Answer Created (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        PrismaService,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Answer content...',
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          receiptId: user.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
