import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      authorId: 'instructor-id',
      questionId: 'question-id',
      content: 'Answer content...',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryAnswerRepository.items[0]).toEqual(result.value.answer)
      expect(
        inMemoryAnswerRepository.items[0].attachments.currentItems,
      ).toHaveLength(2)
      expect(
        inMemoryAnswerRepository.items[0].attachments.currentItems,
      ).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ])
    }
  })

  it('should persist attachments', async () => {
    const result = await sut.execute({
      authorId: 'instructor-id',
      questionId: 'question-id',
      content: 'Answer content...',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(2)
      expect(inMemoryAnswersAttachmentsRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attachmentId: new UniqueEntityId('1'),
          }),
          expect.objectContaining({
            attachmentId: new UniqueEntityId('2'),
          }),
        ]),
      )
    }
  })
})
