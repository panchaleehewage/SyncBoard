export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  testTimeout: 10000
};