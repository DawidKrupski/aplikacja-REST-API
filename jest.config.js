export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.m?js$": "babel-jest",
  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
