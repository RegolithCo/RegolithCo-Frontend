module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testRegex: '.*/src/.*(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js|tsx)$',
  collectCoverageFrom: ['**/src/**/*.{tsx|ts,js}', '!**/src/**/*.d.ts'],
  // setupFilesAfterEnv: ['<rootDir>/jest.env.js'],
}
