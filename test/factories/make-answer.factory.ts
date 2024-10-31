import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Answer,
  AnswerProps,
} from '@/domain/forum/enterprise/entities/answer.entity'
import { faker } from '@faker-js/faker'

export function makeAnswerFactory(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answer
}
