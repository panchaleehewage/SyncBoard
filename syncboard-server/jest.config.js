export default {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  testTimeout: 10000
};