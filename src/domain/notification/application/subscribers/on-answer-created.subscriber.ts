import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler.interface'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository.interface'
import { AnswerCreatedEvent } from '@/domain/forum/events/answer-created.event'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'

export class OnAnswerCreatedSubscriber implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `New answer in "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
