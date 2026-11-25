import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'node_modules/',
      'reports/',
      'test-results/',
      'backups/',
      'dom/',
      'documentation/',
      'AI-Conversation-History/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'pages/**/*.ts', 'fixtures/**/*.ts'],
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      // Page object assertion methods must be named expect*, e.g. expectToast().
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect[A-Z]\\w*$'] }],
    },
  },
  prettier,
);
