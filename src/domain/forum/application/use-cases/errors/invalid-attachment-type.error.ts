import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
