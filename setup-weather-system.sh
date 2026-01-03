#!/bin/bash
# 🌤️ Script de Instalação: Sistema Hora/Clima/Fuso Horário
# Do SPOT Council para Chakana Portal

set -e  # Para em caso de erro

echo "🚀 Instalando Sistema de Clima/Hora do SPOT Council no Chakana Portal"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Diretórios
SPOT_DIR="/Users/danillocosta/spot-council/frontend/src/components/home"
CHAKANA_DIR="$HOME/Projects/Projetos-Internacionais/Chakana-Ivan-Silva/chakana-portal"

# Verificar se está no diretório correto
if [ ! -f "$CHAKANA_DIR/package.json" ]; then
  echo "❌ Erro: Execute este script do diretório do Chakana Portal"
  exit 1
fi

cd "$CHAKANA_DIR"

echo ""
echo "📦 PASSO 1: Criar estrutura de diretórios"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mkdir -p src/components/weather
echo "✅ Criado: src/components/weather/"

echo ""
echo "📋 PASSO 2: Copiar componentes do SPOT Council"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Copiar WeatherWidget
if [ -f "$SPOT_DIR/WeatherWidget.tsx" ]; then
  cp "$SPOT_DIR/WeatherWidget.tsx" src/components/weather/
  echo "✅ Copiado: WeatherWidget.tsx (991 linhas)"
else
  echo "⚠️  Não encontrado: WeatherWidget.tsx"
fi

# Copiar WorldClock
if [ -f "$SPOT_DIR/WorldClock.tsx" ]; then
  cp "$SPOT_DIR/WorldClock.tsx" src/components/weather/
  echo "✅ Copiado: WorldClock.tsx (562 linhas)"
else
  echo "⚠️  Não encontrado: WorldClock.tsx"
fi

# Copiar StatusPanel
if [ -f "$SPOT_DIR/StatusPanel.tsx" ]; then
  cp "$SPOT_DIR/StatusPanel.tsx" src/components/layout/
  echo "✅ Copiado: StatusPanel.tsx (1576 linhas)"
else
  echo "⚠️  Não encontrado: StatusPanel.tsx"
fi

echo ""
echo "🔧 PASSO 3: Verificar dependências"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se Framer Motion está instalado
if grep -q "framer-motion" package.json; then
  echo "✅ framer-motion já instalado"
else
  echo "📦 Instalando framer-motion..."
  npm install framer-motion
fi

# Verificar se Lucide React está instalado
if grep -q "lucide-react" package.json; then
  echo "✅ lucide-react já instalado"
else
  echo "📦 Instalando lucide-react..."
  npm install lucide-react
fi

echo ""
echo "📝 PASSO 4: Criar arquivo de customização"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > src/components/weather/config.ts << 'EOF'
// 🌍 Configuração de Cidades e Fusos Horários para Chakana Portal
// Edite este arquivo para customizar as localizações padrão

export const CHAKANA_DEFAULT_WEATHER_LOCATIONS = [
  {
    id: 'madrid',
    city: 'Madrid',
    country: 'España',
    lat: 40.4168,
    lon: -3.7038,
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    utcOffset: 1
  },
  {
    id: 'barcelona',
    city: 'Barcelona',
    country: 'España',
    lat: 41.3851,
    lon: 2.1734,
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    utcOffset: 1
  }
]

export const CHAKANA_DEFAULT_WORLD_CLOCKS = [
  {
    id: 'madrid',
    city: 'Madrid',
    country: 'España',
    timezone: 'Europe/Madrid',
    flag: '🇪🇸'
  },
  {
    id: 'bogota',
    city: 'Bogotá',
    country: 'Colombia',
    timezone: 'America/Bogota',
    flag: '🇨🇴'
  },
  {
    id: 'lima',
    city: 'Lima',
    country: 'Perú',
    timezone: 'America/Lima',
    flag: '🇵🇪'
  }
]
EOF

echo "✅ Criado: src/components/weather/config.ts"

echo ""
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Editar AppLayout.tsx para adicionar StatusPanel:"
echo "   src/components/layout/AppLayout.tsx"
echo ""
echo "2️⃣  Customizar cidades/timezones (opcional):"
echo "   src/components/weather/config.ts"
echo ""
echo "3️⃣  Testar o sistema:"
echo "   npm run dev"
echo ""
echo "📖 Documentação completa:"
echo "   GUIA-IMPLEMENTACAO-WEATHER.md"
echo ""
echo "🎉 Sistema pronto para uso!"
