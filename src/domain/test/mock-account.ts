import { type AccountModel } from '../models'
import type { AddAccount, Authentication } from '../use-cases'

export const mockAddAccountParams = (override?: Partial<AddAccount.Params>): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  ...override
})

export const mockAccountModel = (override?: Partial<AccountModel>): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'hashed_password',
  ...override
})

export const mockAuthenticationParams = (override?: Partial<Authentication.Params>): Authentication.Params => ({
  email: 'email@mail.com',
  password: 'any_password',
  ...override
})
