import { hash, compare } from 'bcrypt'
import { type HashCompareInput, type HashCompare, type Hasher } from '../../data/protocols'

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  public async compare (input: HashCompareInput): Promise<boolean> {
    await compare(input.plainText, input.hash)
  }

  public async hash (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}
