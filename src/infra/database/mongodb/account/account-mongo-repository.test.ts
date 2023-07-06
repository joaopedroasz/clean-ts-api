import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers'
import { type AccountDocument, AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongoRepository', () => {
  let accountCollection: Collection<AccountDocument>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
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

    it('should return undefined if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('invalid_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    it('should update the account accessToken on success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: '',
        password: 'any_password'
      })

      await sut.updateAccessToken({
        id: insertedId.toHexString(),
        token: 'any_token'
      })

      const account = await accountCollection.findOne({ _id: insertedId })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken', () => {
    it('should return on account on success without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken({
        token: 'any_token'
      })

      expect(account).toBeTruthy()
      expect(account).toEqual({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        id: expect.any(String),
        accessToken: 'any_token'
      })
    })

    it('should return on account on success with role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })

      const account = await sut.loadByToken({
        token: 'any_token',
        role: 'any_role'
      })

      expect(account).toBeTruthy()
      expect(account).toEqual({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        id: expect.any(String),
        accessToken: 'any_token',
        role: 'any_role'
      })
    })

    it('should return undefined if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken({
        token: 'any_wrong_token'
      })

      expect(account).toBeUndefined()
    })

    it('should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken({
        token: 'any_token'
      })

      expect(account).toBeTruthy()
      expect(account).toEqual({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        id: expect.any(String),
        accessToken: 'any_token',
        role: 'admin'
      })
    })

    it('should return undefined if user is not admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken({
        token: 'any_token',
        role: 'admin'
      })

      expect(account).toBeUndefined()
    })
  })
})
