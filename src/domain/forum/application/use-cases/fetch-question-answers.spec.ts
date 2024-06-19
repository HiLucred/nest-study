import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const newQuestion = makeQuestion()

    // Create 3 answers
    for (let i = 1; i <= 3; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({}, newQuestion.id.toString()),
      )
    }

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated recent questions', async () => {
    const newQuestion = makeQuestion()

    // Create 23 questions
    for (let i = 1; i <= 23; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({}, newQuestion.id.toString()),
      )
    }

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3)
    }
  })
})
