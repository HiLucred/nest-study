import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('Should be able to fetch question comments', async () => {
    const newQuestion = makeQuestion()

    // Create 3 question comments
    for (let i = 1; i <= 3; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: newQuestion.id }),
      )
    }

    const result = await sut.execute({
      questionCommentId: newQuestion.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.questionComments).toHaveLength(3)
    }
  })

  it('Should be able to fetch paginated question comments', async () => {
    const newQuestion = makeQuestion()

    // Create 23 question comments
    for (let i = 1; i <= 23; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: newQuestion.id }),
      )
    }

    const result = await sut.execute({
      questionCommentId: newQuestion.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.questionComments).toHaveLength(3)
    }
  })
})
