import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.use-case'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { makeAnswerCommentFactory } from 'test/factories/make-answer-comment.factory'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'
import { makeStudentFactory } from 'test/factories/make-student.factory'

describe('Fetch Answer Comments', () => {
  let sut: FetchAnswerCommentsUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudentFactory({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const firstComment = makeAnswerCommentFactory({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(firstComment)

    const secondComment = makeAnswerCommentFactory({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(secondComment)

    const thirdComment = makeAnswerCommentFactory({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(thirdComment)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: firstComment.id,
        }),

        expect.objectContaining({
          author: 'John Doe',
          commentId: secondComment.id,
        }),

        expect.objectContaining({
          author: 'John Doe',
          commentId: thirdComment.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudentFactory({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerCommentFactory({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
