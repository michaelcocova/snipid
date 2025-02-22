import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  formatters: true,
  typescript: true,
  markdown: false,
}, {
  files: ['**/*.ts'],
  ignores: ['**/*.test.ts'],
  rules: {
    'no-console': 'warn',
    'unused-imports/no-unused-vars': ['warn', {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'after-used',
      argsIgnorePattern: '^_',
    }],
  },
})
