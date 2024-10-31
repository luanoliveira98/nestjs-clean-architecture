import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.use-case'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { makeAnswerCommentFactory } from 'test/factories/make-answer-comment.factory'

describe('Fetch Answer Comments', () => {
  let sut: FetchAnswerCommentsUseCase
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerCommentFactory({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
