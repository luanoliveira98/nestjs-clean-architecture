import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter.interface'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer.interface'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator.interface'

import { JwtEncrypterService } from './jwt-encrypter.service'
import { BcryptHasherService } from './bcrypt-hasher.service'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypterService },
    { provide: HashComparer, useClass: BcryptHasherService },
    { provide: HashGenerator, useClass: BcryptHasherService },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
