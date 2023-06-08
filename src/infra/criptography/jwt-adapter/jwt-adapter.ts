import jwt from 'jsonwebtoken'

import { type Encrypter } from '../../../data/protocols'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ value }, this.secret)
  }
}
