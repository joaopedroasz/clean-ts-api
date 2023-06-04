import { type AuthenticationModel, type Authentication } from '../../../domain/use-cases'
import { type TokenGenerator, type HashCompare, type LoadAccountByEmailRepository } from '../../protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return undefined

    const isValidPassword = await this.hashCompare.compare({ plainText: password, hash: account.password })
    if (!isValidPassword) return undefined

    return await this.tokenGenerator.generate(account.id)
  }
}
