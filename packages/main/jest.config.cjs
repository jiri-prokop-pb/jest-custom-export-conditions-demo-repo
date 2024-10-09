module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  transform: { '^.+\\.ts$': 'babel-jest' },
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['browser', {
      modules: ['msw/*', '@mswjs/interceptors/*'],
      conditions: [],
    }],
  },
};