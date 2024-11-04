import { RegisterStudentUseCase } from './register-student.use-case'
import { HasherFake } from 'test/cryptography/hasher.fake'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'

describe('Register Student', () => {
  let sut: RegisterStudentUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasherFake: HasherFake

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasherFake = new HasherFake()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, hasherFake)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should be able to hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const hashedPassword = await hasherFake.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
