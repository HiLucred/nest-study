import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: newAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: newAnswer.id,
      }),
    )

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'fake-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
