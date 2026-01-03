# 🚀 Chakana Wisdom Engine - Guia de Implementação

**Para desenvolvedores:** Guia prático passo-a-passo para implementar o sistema.

---

## 📦 O Que Já Foi Criado

✅ **Estrutura de pastas:**
```
src/features/wisdom-engine/
├── components/     (vazio - próximo passo)
├── hooks/          (vazio - próximo passo)
├── services/       (vazio - próximo passo)
├── stores/         (vazio - próximo passo)
├── types/
│   └── wisdom-engine.ts ✅ (COMPLETO)
├── data/
│   └── quotes.json ✅ (90 frases)
└── utils/          (vazio - próximo passo)
```

✅ **Documentação:**
- `WISDOM-ENGINE-PLAN.md` - Arquitetura completa
- `IMPLEMENTATION-GUIDE.md` - Este arquivo
- `types/wisdom-engine.ts` - TypeScript types

✅ **Dados:**
- 90 frases categorizadas em quotes.json
- Distribuição: 50% transformação, 25% Chakana, 15% presencia, 10% CTA

---

## 🎯 FASE 1: Fundação (Esta Semana)

### Passo 1: Zustand Store

Crie `src/features/wisdom-engine/stores/wisdomStore.ts`:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Quote,
  WisdomEnginePreferences,
  UserContext,
  WelcomeModalState,
  DEFAULT_WISDOM_PREFERENCES,
} from '../types/wisdom-engine'

interface WisdomStore {
  // State
  currentQuote: Quote | null
  recentQuotes: string[]
  preferences: WisdomEnginePreferences
  welcomeModalState: WelcomeModalState
  sessionActiveMinutes: number

  // Actions
  setCurrentQuote: (quote: Quote) => void
  addRecentQuote: (quoteId: string) => void
  updatePreferences: (prefs: Partial<WisdomEnginePreferences>) => void
  setWelcomeModalState: (state: Partial<WelcomeModalState>) => void
  incrementActiveTime: () => void
  resetSession: () => void
}

export const useWisdomStore = create<WisdomStore>()(
  persist(
    (set) => ({
      // Initial state
      currentQuote: null,
      recentQuotes: [],
      preferences: DEFAULT_WISDOM_PREFERENCES,
      welcomeModalState: {
        isShown: false,
        dismissed: false,
      },
      sessionActiveMinutes: 0,

      // Actions
      setCurrentQuote: (quote) => set({ currentQuote: quote }),

      addRecentQuote: (quoteId) =>
        set((state) => ({
          recentQuotes: [quoteId, ...state.recentQuotes].slice(0, 20),
        })),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      setWelcomeModalState: (modalState) =>
        set((state) => ({
          welcomeModalState: { ...state.welcomeModalState, ...modalState },
        })),

      incrementActiveTime: () =>
        set((state) => ({
          sessionActiveMinutes: state.sessionActiveMinutes + 1,
        })),

      resetSession: () =>
        set({
          sessionActiveMinutes: 0,
          recentQuotes: [],
        }),
    }),
    {
      name: 'chakana:wisdom-engine',
      partialize: (state) => ({
        recentQuotes: state.recentQuotes,
        preferences: state.preferences,
        sessionActiveMinutes: state.sessionActiveMinutes,
      }),
    }
  )
)
```

### Passo 2: Core Service (MVP)

Crie `src/features/wisdom-engine/services/WisdomEngine.ts`:

```typescript
import quotesData from '../data/quotes.json'
import type { Quote, UserContext, QuoteCategory } from '../types/wisdom-engine'

class WisdomEngine {
  private quotes: Quote[]

  constructor() {
    this.quotes = quotesData.quotes
  }

  /**
   * Seleciona uma frase baseada em contexto
   * MVP: Seleção aleatória ponderada
   */
  selectQuote(
    context?: Partial<UserContext>,
    recentQuoteIds: string[] = []
  ): Quote {
    // Filtra quotes recentes
    const availableQuotes = this.quotes.filter(
      (q) => !recentQuoteIds.includes(q.id)
    )

    // Se não há quotes disponíveis, reseta e usa todas
    const quotesToUse = availableQuotes.length > 0 ? availableQuotes : this.quotes

    // Seleção ponderada por weight
    const totalWeight = quotesToUse.reduce((sum, q) => sum + q.weight, 0)
    let random = Math.random() * totalWeight

    for (const quote of quotesToUse) {
      random -= quote.weight
      if (random <= 0) {
        return quote
      }
    }

    // Fallback: retorna primeira quote
    return quotesToUse[0]
  }

  /**
   * Pega quote por ID
   */
  getQuoteById(id: string): Quote | undefined {
    return this.quotes.find((q) => q.id === id)
  }

  /**
   * Pega quotes por categoria
   */
  getQuotesByCategory(category: QuoteCategory): Quote[] {
    return this.quotes.filter((q) => q.category === category)
  }

  /**
   * Busca quotes por tag
   */
  searchQuotes(query: string): Quote[] {
    const lowerQuery = query.toLowerCase()
    return this.quotes.filter(
      (q) =>
        q.text.toLowerCase().includes(lowerQuery) ||
        q.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }
}

// Singleton instance
export const wisdomEngine = new WisdomEngine()
```

### Passo 3: Hook de Rotação

Crie `src/features/wisdom-engine/hooks/useQuoteRotation.ts`:

```typescript
import { useEffect } from 'react'
import { useWisdomStore } from '../stores/wisdomStore'
import { wisdomEngine } from '../services/WisdomEngine'

export function useQuoteRotation(intervalSeconds: number = 12) {
  const { setCurrentQuote, addRecentQuote, recentQuotes, preferences } =
    useWisdomStore()

  useEffect(() => {
    // Seleciona quote inicial
    const initialQuote = wisdomEngine.selectQuote({}, recentQuotes)
    setCurrentQuote(initialQuote)
    addRecentQuote(initialQuote.id)

    // Setup interval de rotação
    const interval = setInterval(() => {
      const nextQuote = wisdomEngine.selectQuote({}, recentQuotes)
      setCurrentQuote(nextQuote)
      addRecentQuote(nextQuote.id)
    }, intervalSeconds * 1000)

    return () => clearInterval(interval)
  }, [intervalSeconds, preferences.headerRotationInterval])
}
```

### Passo 4: Componente Header Básico

Crie `src/features/wisdom-engine/components/ContextualHeader.tsx`:

```typescript
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWisdomStore } from '../stores/wisdomStore'
import { useQuoteRotation } from '../hooks/useQuoteRotation'

export function ContextualHeader() {
  const { currentQuote, preferences } = useWisdomStore()
  const [isPaused, setIsPaused] = useState(false)

  // Hook de rotação automática
  useQuoteRotation(preferences.headerRotationInterval)

  if (!currentQuote) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(currentQuote.text)
    // TODO: Mostrar toast "Reflexión copiada"
  }

  return (
    <div
      className="relative py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8 }}
          className="flex items-start gap-3"
        >
          <span className="text-xl">✨</span>
          <p className="text-base text-gray-400 font-light italic leading-relaxed">
            "{currentQuote.text}"
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Botões de ação (aparecem no hover) */}
      {isPaused && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Copiar
          </button>
          <button className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition">
            Guardar
          </button>
        </div>
      )}
    </div>
  )
}
```

### Passo 5: Integrar no Dashboard

Em `src/pages/Dashboard.tsx`, adicione:

```typescript
import { ContextualHeader } from '@/features/wisdom-engine/components/ContextualHeader'

export function Dashboard() {
  return (
    <div>
      {/* Header existente */}
      <h1>Buenas tardes 🌅</h1>
      <p>Portal Chakana</p>

      {/* NOVO: Wisdom Engine Header */}
      <ContextualHeader />

      {/* Resto do dashboard... */}
    </div>
  )
}
```

---

## ✅ Teste da Fase 1

Após implementar os passos acima:

1. Rode o projeto: `npm run dev`
2. Abra o Dashboard
3. Você deve ver:
   - Frase aparecendo abaixo de "Portal Chakana"
   - Frase mudando a cada 12 segundos
   - Ao hover: botões "Copiar" e "Guardar" aparecem

---

## 🎯 PRÓXIMAS FASES

### Fase 2: Welcome Modal (Próxima Semana)
- Componente WelcomeModal
- Lógica de triggers (segunda-feira, primeiro do mês, etc)
- Animações de entrada/saída

### Fase 3: Micro-Pausas (Semana 3)
- Componente MicroPause
- Timer de atividade
- Breathing exercise

### Fase 4: Saved Reflections (Semana 4)
- Página de reflexões salvas
- Integração Supabase
- Export PDF

---

## 🐛 Troubleshooting

**Erro: "Cannot find module '../data/quotes.json'"**
```typescript
// Adicione ao tsconfig.json:
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

**Erro: "Module not found: Can't resolve '@/features/wisdom-engine'"**
```typescript
// Verifique vite.config.ts tem:
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

**Frases não mudam:**
- Verifique que o interval está rodando (console.log no useEffect)
- Confirme que preferences.headerRotationInterval é número

---

## 📚 Referências

- **Documentação Completa:** `WISDOM-ENGINE-PLAN.md`
- **Types:** `src/features/wisdom-engine/types/wisdom-engine.ts`
- **Quotes:** `src/features/wisdom-engine/data/quotes.json`

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme que todas as dependências estão instaladas
3. Revise o WISDOM-ENGINE-PLAN.md para contexto

**Próximo passo:** Implementar Fase 1 (acima) e testar!
