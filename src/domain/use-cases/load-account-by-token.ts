import { type AccountModel } from '../models'

export interface LoadAccountByTokenModel {
  token: string
  role?: string
}

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenModel) => Promise<AccountModel | undefined>
}
