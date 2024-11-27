import { makeAnswerCommentFactory } from 'test/factories/make-answer-comment.factory'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.use-case'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'

describe('Delete Answer Comment', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: DeleteAnswerCommentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerCommentFactory()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerCommentFactory()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'Wrong-author-id',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)
  })
})
