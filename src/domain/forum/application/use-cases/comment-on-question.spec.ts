import { makeQuestion } from 'test/factories/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemoryQuestionComments: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionComments = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionComments)
  })

  it('should be able to comment on question', async () => {
    const newQuestion = makeQuestion()

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-id',
      content: 'Question comment content...',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryQuestionComments.items[0]).toEqual(
        result.value.questionComment,
      )
    }
  })
})
