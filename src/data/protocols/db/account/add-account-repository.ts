import { type AccountModel } from '@/domain/models'
import { type AddAccountParams } from '@/domain/use-cases'

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
