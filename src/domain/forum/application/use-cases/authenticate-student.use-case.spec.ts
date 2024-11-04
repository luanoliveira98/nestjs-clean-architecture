import { HasherFake } from 'test/cryptography/hasher.fake'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'
import { AuthenticateStudentUseCase } from './authenticate-student.use-case'
import { EncrypterFake } from 'test/cryptography/encrypter.fake'
import { makeStudentFactory } from 'test/factories/make-student.factory'

describe('Authenticate Student', () => {
  let sut: AuthenticateStudentUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let hasherFake: HasherFake
  let encrypterFake: EncrypterFake

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    hasherFake = new HasherFake()
    encrypterFake = new EncrypterFake()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      hasherFake,
      encrypterFake,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudentFactory({
      email: 'johndoe@email.com',
      password: await hasherFake.hash('123456'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
