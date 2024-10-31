import { DeleteQuestionCommentUseCase } from './delete-question-comment.use-case'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { makeQuestionCommentFactory } from 'test/factories/make-question-comment.factory'
import { NotAllowedError } from '@/core/errors/not-allowed.error'

describe('Delete Question Comment', () => {
  let sut: DeleteQuestionCommentUseCase
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionCommentFactory()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionCommentFactory()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'Wrong-author-id',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
  })
})
