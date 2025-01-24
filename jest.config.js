module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript
    testEnvironment: 'jsdom', // Simulates browser environment
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Resolve module paths
        // '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS files
        // '\\.(gif|png|jpe?g|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static assets
    },
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Transform TypeScript and JavaScript files
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'], // Setup Testing Library
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensions for modules
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",  // Specify which files to collect coverage from
        "!src/index.tsx",  // Exclude files if you don't want them
        "!**/node_modules/**"
    ],
    coverageReporters: ['html', 'text'],
};
