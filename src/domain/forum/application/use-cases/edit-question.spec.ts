import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
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
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toEqual(
        result.value.question,
      )
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems,
      ).toHaveLength(2)
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems,
      ).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ])
    }
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'fake-author-id',
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion()
    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })
})
