module.exports = {
  testTimeout: 30000,
  preset: "jest-puppeteer",
  testRegex: "/test/.*",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", ".*RegisterUser.test.ts", "build"],
};
