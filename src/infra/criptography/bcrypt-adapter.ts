import { hash } from 'bcrypt'
import { type Encrypter } from '../../data/protocols'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  public async encrypt (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}
