import { LogMongoRepository } from '@/infra/database/mongodb/log/log-mongo-repository'
import { type Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@main/decorators/log-controller'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
