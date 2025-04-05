module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/src/tests/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
