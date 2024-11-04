import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository.interface'
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository.interface'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository.interface'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository.interface'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository.interface'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository.interface'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository.interface'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
  ],
  exports: [
    PrismaService,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AnswersRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
