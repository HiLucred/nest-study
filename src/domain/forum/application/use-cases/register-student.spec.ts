import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoepassword123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryStudentsRepository.items[0]).toEqual(result.value.student)
    }
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoepassword123',
    })

    const hashedPassword = await fakeHasher.hash('johndoepassword123')

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryStudentsRepository.items[0].password).toEqual(
        hashedPassword,
      )
    }
  })

  it('should not be able to register a student with same email', async () => {
    const newStudent = makeStudent({ email: 'johndoe@email.com' })
    await inMemoryStudentsRepository.create(newStudent)

    const studentWithSameEmail = await sut.execute({
      name: 'Gabriel Dias',
      email: newStudent.email,
      password: 'gabrieldiaspassowrd123',
    })

    expect(studentWithSameEmail.isLeft()).toBe(true)
  })
})
