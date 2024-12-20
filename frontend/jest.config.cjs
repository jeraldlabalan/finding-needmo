module.exports = {
  setupFilesAfterEnv: ["./setupTests.js"],

  moduleNameMapper: {
    "^/src/(.*)": "<rootDir>/src/$1",
    "^src/(.*)$": "<rootDir>/frontend/src/$1",
    "\\.css$": "identity-obj-proxy",
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.(css|less)$": "identity-obj-proxy",
    "\\.css$": "<rootDir>/styleMock.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/styleMock.js",
  },

  transformIgnorePatterns: ["/node_modules/(?!your-dependency-to-transform)/"],

  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|svg)$": "jest-transform-stub",
    "^.+\\.css$": "jest-transform-css",
  },

  testEnvironment: "jsdom",

  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
