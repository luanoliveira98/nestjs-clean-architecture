import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment.factory'
import { StudentFactory } from 'test/factories/make-student.factory'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const firstAttachment = await attachmentFactory.makePrismaAttachment()
    const secondAttachment = await attachmentFactory.makePrismaAttachment()

    const question = {
      title: 'New question',
      content: 'Question content',
      attachments: [
        firstAttachment.id.toString(),
        secondAttachment.id.toString(),
      ],
    }

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(question)

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: question.title },
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { questionId: questionOnDatabase?.id },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
