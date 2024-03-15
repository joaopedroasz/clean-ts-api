import { type AccountModel } from '../../models'

export type LoadAccountByTokenParams = {
  token: string
  role?: string
}

export interface LoadAccountByToken {
  load: (data: LoadAccountByTokenParams) => Promise<AccountModel | undefined>
}
