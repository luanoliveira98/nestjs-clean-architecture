import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments.repository'
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers.repository'
import { PrismaQuestionAttachmentsRepository } from './repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from './repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions.repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
  ],
})
export class DatabaseModule {}
