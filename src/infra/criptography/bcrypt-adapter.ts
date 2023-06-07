import { hash } from 'bcrypt'
import { type Hasher } from '../../data/protocols'

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  public async hash (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}
