/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['./tsconfig.json']
    },

});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
    },


    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ),

    rules: {
        'no-unused-vars': 'off',
        'prefer-const': 'error',
        'no-empty': 'error',
        'no-var': 'error',
        'no-shadow': 'off',
        'eqeqeq': 'error',
        'no-console': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-restricted-types': ['error', { types: {
                'Object': {
                    message: 'Evite o tipo Object, use {} em vez disso.',
                },
                'String': {
                    message: 'Use string em vez de String.'
                },
            }
        }],

        'prettier/prettier': 'error',

        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': ['error', {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true
        }]
        },
    }
]);