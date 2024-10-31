import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { CommentOnAnswerUseCase } from './comment-on-answer.use-case'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswerFactory } from 'test/factories/make-answer.factory'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'

describe('Comment on Answer', () => {
  let sut: CommentOnAnswerUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment a answer', async () => {
    const answer = makeAnswerFactory()

    inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'Test comment',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Test comment',
    )
  })
})
