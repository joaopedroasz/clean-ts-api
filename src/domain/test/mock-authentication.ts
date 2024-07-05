import { type Authentication } from '../use-cases'

export const mockAuthenticationModel = (): Authentication.Model => ({
  accessToken: 'any_token',
  name: 'any_name'
})
