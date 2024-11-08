import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  AttachmentProps,
  Attachment,
} from '@/domain/forum/enterprise/entities/attachment.entity'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper'

export function makeAttachmentFactory(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachmentFactory(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }
}
