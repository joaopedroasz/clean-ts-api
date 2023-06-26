import { type AccountModel } from '../../../../domain/models'

export interface LoadAccountByTokenModel {
  token: string
  role?: string
}

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByTokenModel) => Promise<AccountModel | undefined>
}
