import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers'
import { AccountMongoRepository } from './account'
import { type AddAccountModel } from '../../../../domain/use-cases'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongoRepository', () => {
  let accountCollection: Collection<AddAccountModel>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection<AddAccountModel>('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add', () => {
    it('should return on account on success', async () => {
      const sut = makeSut()

      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      expect(account).toBeTruthy()
      expect(account).toEqual({
        id: expect.any(String),
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })
  })

  describe('loadByEmail', () => {
    it('should return on account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_valid_email@mail.com',
        password: 'any_password'
      })

      const account = await sut.loadByEmail('any_valid_email@mail.com')

      expect(account).toBeTruthy()
      expect(account).toEqual({
        id: expect.any(String),
        name: 'any_name',
        email: 'any_valid_email@mail.com',
        password: 'any_password'
      })
    })
  })
})
