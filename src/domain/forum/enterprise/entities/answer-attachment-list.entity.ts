import { WatchedList } from '@/core/entities/watched-list.entity'
import { AnswerAttachment } from './answer-attachment.entity'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
