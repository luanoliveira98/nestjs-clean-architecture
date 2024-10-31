import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { DeleteAnswerUseCase } from './delete-answer.use-case'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerFactory } from 'test/factories/make-answer.factory'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { makeAnswerAttachmentFactory } from 'test/factories/make-answer-attachment.factory'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'

describe('Delete Answer', () => {
  let sut: DeleteAnswerUseCase
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswerFactory(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({ authorId: 'author-1', answerId: 'answer-1' })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const newAnswer = makeAnswerFactory(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAnswersRepository.items).toHaveLength(1)
  })
})
