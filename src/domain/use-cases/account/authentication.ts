export interface Authentication {
  auth: (authentication: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }
  export type Model = {
    name: string
    accessToken: string
  }
  export type Result = Authentication.Model | undefined
}
