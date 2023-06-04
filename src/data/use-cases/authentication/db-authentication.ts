import {
  type TokenGenerator,
  type HashCompare,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type Authentication,
  type AuthenticationModel
} from './protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string | undefined> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return undefined

    const isValidPassword = await this.hashCompare.compare({ plainText: password, hash: account.password })
    if (!isValidPassword) return undefined

    const accessToken = await this.tokenGenerator.generate(account.id)

    await this.updateAccessTokenRepository.update({ id: account.id, token: accessToken })

    return accessToken
  }
}
