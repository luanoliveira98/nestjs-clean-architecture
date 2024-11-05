import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment.factory'
import { AnswerFactory } from 'test/factories/make-answer.factory'
import { QuestionFactory } from 'test/factories/make-question.factory'
import { StudentFactory } from 'test/factories/make-student.factory'

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswer({
      authorId: user.id,
      answerId: answer.id,
    })

    const answerCommentId = answerComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: { id: answerCommentId },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
