module.exports = {
  root: true,
  extends: '@react-native-community',
  ignorePatterns: ['src/types/supabase.ts'],
  env: {
    'jest/globals': true,
  },
  overrides: [
    {
      files: ['__tests__/**', 'e2e/**'],
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
