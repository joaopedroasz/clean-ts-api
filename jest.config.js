module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**', '!<rootDir>/src/**/*protocols.ts', '!**/protocols/**', '!**/**/index.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  roots: ['<rootDir>/src'],
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@factories/(.*)': '<rootDir>/src/main/factories/$1'
  }
}
