export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],

    // FIX FOR IMPORTING PNG, JPG, SVG...
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
    }
};
