import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('Should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({ authorId: student.id })

    const comment1 = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
      expect(result.value.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: student.name,
            commentId: comment1.id,
          }),
          expect.objectContaining({
            author: student.name,
            commentId: comment2.id,
          }),
          expect.objectContaining({
            author: student.name,
            commentId: comment2.id,
          }),
        ]),
      )
    }
  })

  it('Should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({ authorId: student.id })

    // Create 23 question comments
    for (let i = 1; i <= 23; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: newQuestion.id,
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
    }
  })
})
