import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { CommentOnQuestionUseCase } from './comment-on-question.use-case'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { makeQuestionFactory } from 'test/factories/make-question.factory'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'

describe('Comment on Question', () => {
  let sut: CommentOnQuestionUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment a question', async () => {
    const question = makeQuestionFactory()

    inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'Test comment',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Test comment',
    )
  })
})
