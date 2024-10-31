import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event.interface'
import { Answer } from '../enterprise/entities/answer.entity'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.ocurredAt = new Date()
    this.answer = answer
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
