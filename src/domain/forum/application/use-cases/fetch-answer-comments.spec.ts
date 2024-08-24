import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const newAnswer = makeAnswer({ authorId: student.id })

    const comment1 = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
      expect(result.value.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            content: comment1.content,
            authorId: comment1.authorId,
          }),
          expect.objectContaining({
            content: comment1.content,
            authorId: comment1.authorId,
          }),
          expect.objectContaining({
            content: comment1.content,
            authorId: comment1.authorId,
          }),
        ]),
      )
    }
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const newAnswer = makeAnswer({ authorId: student.id })

    // Create 23 answer comments
    for (let i = 1; i <= 23; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: newAnswer.id, authorId: student.id }),
      )
    }

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
    }
  })
})
