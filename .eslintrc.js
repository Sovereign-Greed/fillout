module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2020
    },
    requireConfigFile: false,
    rules: {
        // Your custom rules here
    }
};