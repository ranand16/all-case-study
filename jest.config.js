module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$$": "babel-jest"
    }
};
