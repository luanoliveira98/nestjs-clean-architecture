import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler.interface'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/events/question-best-answer-chosen.event'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository.interface'

export class OnQuestionBestAnswerChosenSubscriber implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Your answer has been chosen',
        content: `The answer you submitted in "${question.title.substring(0, 20).concat('...')}" was chosen by the author`,
      })
    }
  }
}
