// See: https://jestjs.io/docs/configuration

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/__mocks__/'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100
  //   }
  // },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['<rootDir>/src', '<rootDir>/node_modules'],
  preset: 'ts-jest',
  reporters: ['default'],
  resolver: 'ts-jest-resolver',
  setupFilesAfterEnv: [
    '<rootDir>/tsconfig.json',
    '<rootDir>/tsconfig.eslint.json'
  ],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
  transformIgnorePatterns: [
    'node_modules/(?!@jest/)',
    '.*\\.(spec|test)\\.(js|jsx)$'
  ],
  verbose: true
};
