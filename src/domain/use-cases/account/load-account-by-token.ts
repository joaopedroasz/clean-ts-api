import { type AccountModel } from '../../models'

export interface LoadAccountByToken {
  load: (data: LoadAccountByToken.Params) => Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
  export type Params = {
    token: string
    role?: string
  }
  export type Result = AccountModel | undefined
}
