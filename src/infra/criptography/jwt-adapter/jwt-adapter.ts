import jwt from 'jsonwebtoken'

import { type Decrypter, type Encrypter } from '../../../data/protocols'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ value }, this.secret)
  }

  async decrypt (value: string): Promise<string | undefined> {
    return jwt.verify(value, this.secret) as string
  }
}
