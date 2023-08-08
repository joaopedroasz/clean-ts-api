export type UpdateAccessTokenInput = {
  id: string
  token: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (input: UpdateAccessTokenInput) => Promise<void>
}
