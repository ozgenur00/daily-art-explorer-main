module.exports = {

    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)', // Transpile ES modules in axios
    ],
    moduleFileExtensions: ['js', 'jsx'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS files
    },
  };
  