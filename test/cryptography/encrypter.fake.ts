import { Encrypter } from '@/domain/forum/application/cryptography/encrypter.interface'

export class EncrypterFake implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
