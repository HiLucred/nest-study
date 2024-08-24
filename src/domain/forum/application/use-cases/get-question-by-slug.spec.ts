import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({
      slug: Slug.create('title-slug'),
      authorId: student.id,
    })
    await inMemoryQuestionsRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Some attachment',
    })
    inMemoryAttachmentsRepository.items.push(attachment)

    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    })
    inMemoryQuestionAttachmentsRepository.items.push(questionAttachment)

    const result = await sut.execute({
      slug: 'title-slug',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: attachment.title,
            }),
          ],
        }),
      })
    }
  })
})
