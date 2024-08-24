import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerComments: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerComments = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new CommentOnAnswerUseCase(inMemoryAnswerComments)
  })

  it('should be able to comment on answer', async () => {
    const newAnswer = makeAnswer({})

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-id',
      content: 'Answer comment content...',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswerComments.items[0]).toEqual(
        result.value.answerComment,
      )
    }
  })
})
