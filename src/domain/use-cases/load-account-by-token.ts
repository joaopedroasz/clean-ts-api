import { type AccountModel } from '../models'

export type LoadAccountByTokenModel = {
  token: string
  role?: string
}

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenModel) => Promise<AccountModel | undefined>
}
