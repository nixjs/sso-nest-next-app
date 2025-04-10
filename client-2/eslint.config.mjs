import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
    {
        rules: {
            'array-callback-return': 'warn',
            'default-case': [
                'warn',
                {
                    commentPattern: '^no default$'
                }
            ],
            'dot-location': ['warn', 'property'],
            eqeqeq: ['warn', 'smart'],
            'new-parens': 'warn',
            'no-array-constructor': 'warn',
            'no-caller': 'warn',
            'no-shadow': 'off',
            'no-cond-assign': ['warn', 'except-parens'],
            'no-const-assign': 'warn',
            'no-async-promise-executor': 'off',
            'no-control-regex': 'warn',
            'no-delete-var': 'warn',
            'no-dupe-args': 'warn',
            'no-dupe-class-members': 'warn',
            'no-dupe-keys': 'warn',
            'no-duplicate-case': 'warn',
            'no-empty-character-class': 'warn',
            'no-empty-pattern': 'warn',
            'no-eval': 'warn',
            'no-ex-assign': 'warn',
            'no-extend-native': 'warn',
            'no-extra-bind': 'warn',
            'no-extra-label': 'warn',
            'no-fallthrough': 'warn',
            'no-func-assign': 'warn',
            'no-implied-eval': 'warn',
            'no-invalid-regexp': 'warn',
            'no-iterator': 'warn',
            'no-label-var': 'warn',
            'no-labels': [
                'warn',
                {
                    allowLoop: true,
                    allowSwitch: false
                }
            ],
            'no-lone-blocks': 'warn',
            'no-loop-func': 'warn',
            'no-mixed-operators': [
                'warn',
                {
                    groups: [
                        ['&', '|', '^', '~', '<<', '>>', '>>>'],
                        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                        ['&&', '||'],
                        ['in', 'instanceof']
                    ],
                    allowSamePrecedence: false
                }
            ],
            'no-multi-str': 'warn',
            'no-native-reassign': 'warn',
            'no-negated-in-lhs': 'warn',
            'no-new-func': 'warn',
            'no-new-object': 'warn',
            'no-new-symbol': 'warn',
            'no-new-wrappers': 'warn',
            'no-obj-calls': 'warn',
            'no-octal': 'warn',
            'no-octal-escape': 'warn',
            'no-redeclare': [
                'warn',
                {
                    builtinGlobals: false
                }
            ],
            'no-regex-spaces': 'warn',
            'no-restricted-syntax': [
                'warn',
                'WithStatement',
                {
                    message: 'substr() is deprecated, use slice() or substring() instead',
                    selector: "MemberExpression > Identifier[name='substr']"
                }
            ],
            'no-script-url': 'warn',
            'no-self-assign': 'warn',
            'no-self-compare': 'warn',
            'no-sequences': 'warn',
            'no-shadow-restricted-names': 'warn',
            'no-sparse-arrays': 'warn',
            'no-template-curly-in-string': 'error',
            'no-this-before-super': 'warn',
            'no-throw-literal': 'warn',
            'no-undef': 'off',
            'no-unexpected-multiline': 'warn',
            'no-unreachable': 'warn',
            'no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true
                }
            ],
            'no-unused-labels': 'warn',
            'no-unused-vars': [
                'warn',
                {
                    args: 'none',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    caughtErrors: 'none',
                    caughtErrorsIgnorePattern: '^ignore'
                }
            ],
            'no-use-before-define': [
                'warn',
                {
                    functions: false,
                    classes: false,
                    variables: false
                }
            ],
            'no-useless-computed-key': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-constructor': 'warn',
            'no-useless-escape': 'warn',
            'no-useless-rename': [
                'warn',
                {
                    ignoreDestructuring: false,
                    ignoreImport: false,
                    ignoreExport: false
                }
            ],
            'no-with': 'warn',
            'no-whitespace-before-property': 'warn',
            'require-yield': 'warn',
            'rest-spread-spacing': ['warn', 'never'],
            strict: ['warn', 'never'],
            'unicode-bom': ['warn', 'never'],
            'use-isnan': 'warn',
            'valid-typeof': 'warn',
            'getter-return': 'warn',
            'react/forbid-foreign-prop-types': [
                'warn',
                {
                    allowInPropTypes: true
                }
            ],
            'react/jsx-no-comment-textnodes': 'warn',
            'react/jsx-no-duplicate-props': 'warn',
            'react/jsx-no-target-blank': 'warn',
            'react/jsx-no-undef': 'off',
            'react/jsx-pascal-case': [
                'warn',
                {
                    allowAllCaps: true,
                    ignore: []
                }
            ],
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react/jsx-uses-react': 'warn',
            'react/jsx-uses-vars': 'warn',
            'react/no-danger-with-children': 'warn',
            'react/no-deprecated': 'warn',
            'react/no-direct-mutation-state': 'warn',
            'react/no-is-mounted': 'warn',
            'react/no-typos': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/require-render-return': 'error',
            'react/style-prop-object': 'warn',
            'jsx-a11y/anchor-is-valid': 'off',
            'jsx-a11y/label-has-associated-control': 'warn',
            'jsx-a11y/scope': 'warn',
            'no-case-declarations': 'off',
            'no-shadow': 'off',
            'react/jsx-key': 'off',
            'no-use-before-define': 'off',
            'no-empty': 'off',
            'no-async-promise-executor': ['off'],
            'no-empty-pattern': ['off'],
            'no-var': ['error'],
            'no-plusplus': 'off',
            semi: 'off',
            'object-curly-spacing': ['error', 'always'],
            'no-underscore-dangle': 'off',
            'spaced-comment': ['off'],
            'no-prototype-builtins': ['off'],
            'sort-keys': ['off'],
            'space-before-function-paren': ['off'],
            indent: ['off'],
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            // Nextjs
            '@next/next/no-html-link-for-pages': 'off',
            // React
            'react/react-in-jsx-scope': 'off',
            // Typescript
            '@typescript-eslint/no-shadow': ['off'],
            '@typescript-eslint/ban-ts-ignore': ['off'],
            '@typescript-eslint/explicit-function-return-type': ['off'],
            '@typescript-eslint/interface-name-prefix': ['off'],
            '@typescript-eslint/no-explicit-any': ['off'],
            '@typescript-eslint/no-unused-expressions': ['off'],
            '@typescript-eslint/no-var-requires': ['off'],
            '@typescript-eslint/no-use-before-define': ['off'],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    caughtErrors: 'none',
                    caughtErrorsIgnorePattern: '^ignore'
                }
            ],
            '@typescript-eslint/no-namespace': ['off'],
            '@typescript-eslint/no-non-null-assertion': ['off'],
            '@typescript-eslint/ban-ts-comment': ['off'],
            '@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
            '@typescript-eslint/no-empty-object-type': 'off',
            'jsx-a11y/interactive-supports-focus': 'off',
            'jsx-a11y/no-static-element-interactions': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-static-element-interactions': 'off',
            'jsx-a11y/media-has-caption': 'off',
            'jsx-a11y/iframe-has-title': 'off',
            'jsx-a11y/scope': 'off'
        }
    }
]

export default eslintConfig
