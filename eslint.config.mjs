import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  // ---------------------------------------------------------------- 忽略范围
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.output/**',
      '**/.turbo/**',
      '**/coverage/**',
    ],
  },

  // ---------------------------------------------------------------- 基础规则
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  // ---------------------------------------------------------------- 全仓库通用
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 未使用变量：允许以 _ 开头的占位参数
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // 规范要求：显式收敛随意性
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'no-implicit-coercion': 'error',
      curly: ['error', 'multi-line'],
    },
  },

  // ---------------------------------------------------------------- .astro 文件
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },

  // ---------------------------------------------------------------- 配置文件本身放宽
  {
    files: ['**/*.config.{js,mjs,cjs,ts}', '**/eslint.config.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
);
