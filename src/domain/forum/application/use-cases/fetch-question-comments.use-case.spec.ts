import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.use-case'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { makeQuestionCommentFactory } from 'test/factories/make-question-comment.factory'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'
import { makeStudentFactory } from 'test/factories/make-student.factory'

describe('Fetch Question Comments', () => {
  let sut: FetchQuestionCommentsUseCase
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudentFactory({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const firstComment = makeQuestionCommentFactory({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(firstComment)

    const secondComment = makeQuestionCommentFactory({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(secondComment)

    const thirdComment = makeQuestionCommentFactory({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(thirdComment)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudentFactory({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionCommentFactory({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
