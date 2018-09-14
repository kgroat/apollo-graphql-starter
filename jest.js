module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/.jest/setupTests.js',
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  testRegex: 'src/.*(__tests__/.*|\\.spec)\\.ts$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],
  cacheDirectory: 'jestCache',
  globals: {
    __DEV__: true,
    'ts-jest': {
      'tsConfigFile': 'tsconfig.test.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/bootstrap.ts',
    '!src/config.ts',
    '!src/db.ts',
    '!src/schema.ts',
    '!src/server.ts',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 59,
      branches: 35,
      functions: 61,
      lines: 59,
    },
  },
}
