import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository.interface'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment.entity'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
