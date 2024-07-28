import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import * as bycrpt from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return bycrpt.hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bycrpt.compare(plain, hash)
  }
}
