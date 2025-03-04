import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { DeleteQuestionUseCase } from './delete-question.use-case'
import { makeQuestionFactory } from 'test/factories/make-question.factory'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestionAttachmentFactory } from 'test/factories/make-question-attachment.factory'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'

describe('Delete Question', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestionFactory(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({ authorId: 'author-1', questionId: 'question-1' })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestionFactory(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryQuestionsRepository.items).toHaveLength(1)
  })
})
