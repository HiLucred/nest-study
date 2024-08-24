import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification'
import { StudentFactory } from 'test/factories/make-student'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId', async () => {
    const student = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: student.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: student.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationReadOnDatabase = await prisma.notification.findFirst({
      where: {
        receiptId: student.id.toString(),
      },
    })

    expect(notificationReadOnDatabase?.readAt).not.toBeNull()
  })
})
