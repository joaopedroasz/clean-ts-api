import {
  type Encrypter,
  type HashCompare,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type Authentication,
  type AuthenticationParams,
  type AuthenticationModel
} from './protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth ({ email, password }: AuthenticationParams): Promise<AuthenticationModel | undefined> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return undefined

    const isValidPassword = await this.hashCompare.compare({ plainText: password, hash: account.password })
    if (!isValidPassword) return undefined

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.updateAccessToken({ id: account.id, token: accessToken })

    return {
      accessToken,
      name: account.name
    }
  }
}
