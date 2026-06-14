import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  {
    // Aplica estas regras tanto para JS quanto para TS/TSX
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Força as regras do Prettier (remover ponto e vírgula, etc) como ERRO
      'prettier/prettier': 'error',

      // Alertas para variáveis não usadas
      'no-unused-vars': 'off', // Desativa a do JS puro
      '@typescript-eslint/no-unused-vars': 'warn', // Ativa a versão correta para TS

      // REORDENAÇÃO AUTOMÁTICA DOS IMPORTS (Gera alerta e corrige ao salvar)
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', // Imports nativos (ex: path, fs)
            'external', // Bibliotecas (ex: react, next)
            'internal', // Aliases do projeto (ex: @/components)
            ['parent', 'sibling'], // Arquivos locais (ex: ../, ./)
            'index',
            'object',
          ],
          'newlines-between': 'always', // Adiciona uma linha em branco entre os blocos
          alphabetize: {
            order: 'asc', // Ordem alfabética de A-Z
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  prettierConfig, // Sempre por último
]
