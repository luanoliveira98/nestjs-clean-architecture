import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.use-case'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { makeQuestionCommentFactory } from 'test/factories/make-question-comment.factory'

describe('Fetch Question Comments', () => {
  let sut: FetchQuestionCommentsUseCase
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionCommentFactory({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
