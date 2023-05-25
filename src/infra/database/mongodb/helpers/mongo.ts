import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: undefined as unknown as MongoClient | undefined,
  connect: async (uri: string): Promise<void> => {
    MongoHelper.client = await MongoClient.connect(uri)
  },
  disconnect: async (): Promise<void> => {
    await MongoHelper?.client?.close()
  }
}
