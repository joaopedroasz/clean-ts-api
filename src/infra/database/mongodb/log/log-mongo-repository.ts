import { type LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '../helpers'

type AddErrorModel = {
  stack: string
  date: Date
}

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection<AddErrorModel>('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
