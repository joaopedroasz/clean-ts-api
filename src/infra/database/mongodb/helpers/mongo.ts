import { type Collection, MongoClient, type Document } from 'mongodb'

export const MongoHelper = {
  client: undefined as unknown as MongoClient | undefined,
  connect: async (uri: string): Promise<void> => {
    MongoHelper.client = await MongoClient.connect(uri)
  },
  disconnect: async (): Promise<void> => {
    await MongoHelper.client?.close()
  },
  getCollection: <CollectionType extends Document>(name: string): Collection<CollectionType> => {
    if (!MongoHelper.client) {
      throw new Error('MongoDB not connected')
    }
    return MongoHelper.client.db().collection(name)
  }
}
