import { type AccountModel } from '../../domain/models'
import { type AddAccountModel } from '../../domain/use-cases'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
