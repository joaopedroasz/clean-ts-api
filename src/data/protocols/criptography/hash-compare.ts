export type HashCompareInput = {
  plainText: string
  hash: string
}

export interface HashCompare {
  compare: (input: HashCompareInput) => Promise<boolean>
}
