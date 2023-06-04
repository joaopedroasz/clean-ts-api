export interface UpdateAccessTokenInput {
  id: string
  token: string
}

export interface UpdateAccessTokenRepository {
  update: (input: UpdateAccessTokenInput) => Promise<void>
}
