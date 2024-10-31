import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event.interface'
import { Question } from '../enterprise/entities/question.entity'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.question = question
    this.bestAnswerId = bestAnswerId
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
