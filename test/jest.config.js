module.exports = {
  testTimeout: 30000,
  preset: "jest-puppeteer",
  testRegex: "./e2e/.*",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["./e2e/RegisterUser.test.ts"],
};
