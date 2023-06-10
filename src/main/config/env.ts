export default {
  MONGO_URL: process.env.MONGO_URL ?? 'mongodb://mongo:27017/clean-mongodb',
  SERVER_PORT: process.env.SERVER_PORT ?? 3000,
  JWT_SECRET: process.env.JWT_SECRET ?? 'A][)*S3k37_4h&g'
}
