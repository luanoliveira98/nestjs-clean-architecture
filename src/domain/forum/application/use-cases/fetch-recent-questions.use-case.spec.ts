import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { makeQuestionFactory } from 'test/factories/make-question.factory'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions.use-case'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'

describe('Fetch Recent Questions', () => {
  let sut: FetchRecentQuestionsUseCase
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestionFactory({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestionFactory({ createdAt: new Date(2024, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestionFactory({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestionFactory())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
