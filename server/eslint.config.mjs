// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },
            ecmaVersion: 5,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        rules: {
            'no-case-declarations': 'off',
            'no-shadow': 'off',
            'react/jsx-key': 'off',
            'no-use-before-define': 'off',
            'no-async-promise-executor': ['off'],
            'no-empty-pattern': ['off'],
            'no-undef': ['error'],
            'no-var': ['error'],
            'no-plusplus': 'off',
            semi: 'off',
            'object-curly-spacing': ['error', 'always'],
            'prettier/prettier': 'error',
            'no-underscore-dangle': 'off',
            'spaced-comment': ['off'],
            'no-prototype-builtins': ['off'],
            'sort-keys': ['off'],
            'space-before-function-paren': ['off'],
            indent: ['off'],
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off'
        }
    }
)
