import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Regras de dependência da skill `arquitetura` (§8 e stack.md, seção Lint).
const vendorSdk = { group: ['@supabase/*'], message: 'SDK só em lib/, repositories/ e services/.' }
const deepFeature = {
  group: ['@/features/*/*'],
  message: 'Importe a feature pelo index.ts (@/features/<x>).',
}
const infra = [
  {
    group: ['@/repositories/*', '@/services/*', '@/lib/*'],
    message: 'UI não importa infraestrutura; use hooks da feature.',
  },
]

const restrict = (...patterns) => ({
  'no-restricted-imports': ['error', { patterns: patterns.flat() }],
})

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'node_modules/**']),

  // Base para todo o src: SDK do fornecedor e imports profundos em features.
  { files: ['src/**/*.{ts,tsx}'], rules: restrict(vendorSdk, deepFeature) },

  // Infraestrutura pode usar o SDK.
  {
    files: ['src/lib/**', 'src/repositories/**', 'src/services/**'],
    rules: restrict(deepFeature),
  },

  // Apresentação: sem infraestrutura e sem features (components/ é genérico).
  {
    files: ['src/components/**', 'src/views/**', 'src/features/*/components/**'],
    rules: restrict(vendorSdk, deepFeature, infra),
  },
  {
    files: ['src/components/**'],
    rules: restrict(vendorSdk, deepFeature, infra, {
      group: ['@/features/*'],
      message: 'components/ não importa features/.',
    }),
  },

  // Rotas do Next: finas, só views e features.
  { files: ['src/app/**'], rules: restrict(vendorSdk, deepFeature, infra) },
])
