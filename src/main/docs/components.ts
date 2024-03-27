import { apiKeyAuthSchema } from './schemas/'
import {
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from './components/'

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  serverError: serverErrorComponent,
  unauthorized: unauthorizedComponent,
  notFound: notFoundComponent,
  forbidden: forbiddenComponent
}
