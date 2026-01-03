# 🌤️ Guia de Implementação: Sistema Hora/Clima/Fuso Horário
## Para Chakana Portal

**Fonte:** SPOT Council (`/Users/danillocosta/spot-council/frontend/`)
**Destino:** Chakana Portal (`~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal/`)

---

## 📦 PASSO 1: Copiar Arquivos Base

```bash
# Criar estrutura
mkdir -p ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal/src/components/weather

# Copiar componentes principais
cp /Users/danillocosta/spot-council/frontend/src/components/home/WeatherWidget.tsx \
   ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal/src/components/weather/

cp /Users/danillocosta/spot-council/frontend/src/components/home/WorldClock.tsx \
   ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal/src/components/weather/

cp /Users/danillocosta/spot-council/frontend/src/components/home/StatusPanel.tsx \
   ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal/src/components/layout/
```

---

## ⚙️ PASSO 2: Dependências Necessárias

```bash
cd ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal

# Instalar dependências (se ainda não tiver)
npm install framer-motion lucide-react
```

**Verificar se já tem no `package.json`:**
- ✅ React 18+
- ✅ TypeScript
- ✅ Tailwind CSS
- ⚠️ Framer Motion (adicionar se não tiver)
- ⚠️ Lucide React (ícones)

---

## 🏗️ PASSO 3: Estrutura de Arquivos

```
chakana-portal/src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx         ← MODIFICAR (adicionar StatusPanel)
│   │   ├── Header.tsx
│   │   ├── NavigationRail.tsx
│   │   └── StatusPanel.tsx       ← NOVO (copiado do SPOT)
│   └── weather/
│       ├── WeatherWidget.tsx     ← NOVO (copiado do SPOT)
│       └── WorldClock.tsx        ← NOVO (copiado do SPOT)
```

---

## 🔧 PASSO 4: Integração no AppLayout

**Arquivo:** `src/components/layout/AppLayout.tsx`

```typescript
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusPanel from './StatusPanel'

export default function AppLayout({ children }) {
  const [showStatusPanel, setShowStatusPanel] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Navigation Rail (esquerda) */}
      <NavigationRail />

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* StatusPanel (direita) */}
      <div className="hidden lg:flex h-full relative border-l border-border/40">
        <AnimatePresence mode="wait">
          {showStatusPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-y-auto"
            >
              <StatusPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botão Toggle (opcional) */}
      <button
        onClick={() => setShowStatusPanel(!showStatusPanel)}
        className="fixed bottom-4 right-4 lg:hidden rounded-full p-3 bg-primary text-primary-foreground shadow-lg"
      >
        {showStatusPanel ? '→' : '←'}
      </button>
    </div>
  )
}
```

---

## 🎨 PASSO 5: Customizações para Chakana

### **5.1. Alterar Cidades Padrão**

**Arquivo:** `components/weather/WeatherWidget.tsx` (linha ~40)

```typescript
// ANTES (SPOT Council):
const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { id: 'default', city: 'São Paulo', country: 'Brasil', lat: -23.5505, lon: -46.6333, flag: '🇧🇷', timezone: 'America/Sao_Paulo', utcOffset: -3 }
]

// DEPOIS (Chakana):
const DEFAULT_LOCATIONS: WeatherLocation[] = [
  { id: 'default', city: 'Madrid', country: 'España', lat: 40.4168, lon: -3.7038, flag: '🇪🇸', timezone: 'Europe/Madrid', utcOffset: 1 },
  { id: 'secondary', city: 'Barcelona', country: 'España', lat: 41.3851, lon: 2.1734, flag: '🇪🇸', timezone: 'Europe/Madrid', utcOffset: 1 }
]
```

### **5.2. Alterar Fusos Horários Padrão**

**Arquivo:** `components/weather/WorldClock.tsx` (linha ~30)

```typescript
// ANTES:
const DEFAULT_TIMEZONES = [
  'America/Sao_Paulo',
  'Europe/Madrid',
  'America/Los_Angeles'
]

// DEPOIS (Chakana):
const DEFAULT_TIMEZONES = [
  'Europe/Madrid',
  'America/Bogota',
  'America/Lima',
  'America/New_York'
]
```

### **5.3. Ajustar Cores/Tema**

Se o Chakana usar tema diferente, ajustar classes Tailwind em:
- `StatusPanel.tsx` → glassmorphism backgrounds
- `WeatherWidget.tsx` → card styling
- `WorldClock.tsx` → text colors

---

## 🧪 PASSO 6: Testar

```bash
cd ~/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal
npm run dev
```

**Checklist:**
- ✅ Clima carregando (Open-Meteo API funciona sem chave)
- ✅ Relógios atualizando em tempo real
- ✅ localStorage salvando preferências
- ✅ Painel colapsável funcionando
- ✅ Responsivo em mobile

---

## 🔑 APIs e Chaves

### **Open-Meteo (Clima)**
- 🆓 **Gratuita** (sem API key)
- 📍 Endpoint: `https://api.open-meteo.com/v1/forecast`
- 📖 Docs: https://open-meteo.com/en/docs

### **Intl.DateTimeFormat (Fusos)**
- 🆓 **Nativo do navegador** (sem API)
- 🌍 IANA Timezone Database

---

## 📂 Arquivos de Referência

| Componente | Arquivo SPOT Council | Linhas | Função |
|------------|---------------------|--------|--------|
| Weather | `src/components/home/WeatherWidget.tsx` | 991 | Multi-location weather |
| Clock | `src/components/home/WorldClock.tsx` | 562 | Relógios mundiais |
| Panel | `src/components/home/StatusPanel.tsx` | 1576 | Container lateral |
| Home | `src/components/home/HomePage.tsx` | 547 | Integração principal |

---

## 🎯 Features Principais

1. **WeatherWidget**
   - ☁️ Até 4 cidades simultâneas
   - 🔄 Cache localStorage (10min)
   - 🌡️ Temperatura + sensação térmica
   - 💨 Vento + umidade
   - 🕐 Timezone com UTC offset

2. **WorldClock**
   - ⏰ Relógios em tempo real (1s update)
   - 🌍 Auto-detect timezone local
   - ⏱️ Diferença de horário calculada
   - 📍 Até 3 locais extras

3. **StatusPanel**
   - 📱 Responsivo (hide em mobile)
   - 🎨 Glassmorphism Apple-style
   - 💾 Persistência de preferências
   - ⌨️ Keyboard shortcuts (⌘])

---

## 🚀 Extras Opcionais

### **Adicionar Geocoding**
Se quiser busca por nome de cidade (atualmente só coordenadas):

```bash
npm install @mapbox/search-js-core
```

Adicionar API key Mapbox no `.env`:
```
VITE_MAPBOX_TOKEN=pk.your_token_here
```

### **Adicionar Forecast de 7 dias**
Modificar parâmetro `forecast_days` no Open-Meteo:

```typescript
const url = `https://api.open-meteo.com/v1/forecast?
  latitude=${lat}&longitude=${lon}
  &current=temperature_2m,weather_code
  &daily=temperature_2m_max,temperature_2m_min,weather_code
  &forecast_days=7`
```

---

## 📞 Suporte

**Dúvidas?** Consultar código fonte original:
```
/Users/danillocosta/spot-council/frontend/src/components/home/
```

**Issue comum:** Se clima não carregar, verificar CORS no navegador (Open-Meteo tem CORS liberado).

---

**Última atualização:** 02/01/2026
**Versão:** 1.0.0
