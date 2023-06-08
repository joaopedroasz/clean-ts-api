import { hash, compare } from 'bcrypt'
import { type HashCompareInput, type HashCompare, type Hasher } from '../../../data/protocols'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (private readonly salt: number) {}

  public async compare (input: HashCompareInput): Promise<boolean> {
    return await compare(input.plainText, input.hash)
  }

  public async hash (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}
