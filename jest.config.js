module.exports = {
  testTimeout: 30000,
  testRegex: ".*.test.tsx",
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "build", "/test/"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
  testEnvironment: "jsdom",
};
