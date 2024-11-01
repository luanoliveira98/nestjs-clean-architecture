import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid.')
  }
}
