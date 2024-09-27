export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
  moduleNameMapper: {
    "^aos$": "<rootDir>/aos", // Map the "aos" module to the actual aos directory
  },
};
