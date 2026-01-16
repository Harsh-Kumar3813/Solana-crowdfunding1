import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,

  // ✅ Custom rules for your repo
  {
    rules: {
      // Because Anchor/IDL uses snake_case
      '@typescript-eslint/naming-convention': 'off',

      // You can keep this warning-level, it won't block build
      'react-hooks/exhaustive-deps': 'warn',

      // Sometimes unavoidable in Next.js + blockchain projects
      '@next/next/no-img-element': 'off',
    },
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',

    // ✅ Ignore anchor scripts (prevents lint noise)
    'anchor/**',
  ]),
])
