/**
 * Chakana Wisdom Engine - Analytics Dashboard
 * Version: 1.0.0
 *
 * Visualizes user engagement analytics:
 * - Overview cards (total, streaks, favorites)
 * - Category breakdown pie chart
 * - Activity timeline
 * - Top tags and authors
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  Award,
  Calendar,
  Hash,
  User,
  Heart,
  Flame,
} from 'lucide-react'
import { analytics } from '../services/Analytics'
import type { SavedReflection } from '../types/wisdom-engine'

interface AnalyticsDashboardProps {
  /** All saved reflections */
  reflections: SavedReflection[]
}

/**
 * Category color mapping (Chakana brand colors)
 */
const CATEGORY_COLORS: Record<string, string> = {
  transformation: '#4A7C59', // sage
  chakana: '#8FBC8F', // mint
  connection: '#D4AF37', // gold
  nature: '#A78BFA', // purple
}

/**
 * Analytics Dashboard Component
 */
export function AnalyticsDashboard({ reflections }: AnalyticsDashboardProps) {
  // Compute analytics summary
  const summary = useMemo(() => {
    return analytics.computeSummary(reflections)
  }, [reflections])

  // No data state
  if (summary.totalReflections === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="w-16 h-16 text-white/20 mb-4" />
        <h3 className="text-xl font-semibold text-white/60 mb-2">
          No hay reflexiones guardadas aún
        </h3>
        <p className="text-white/40 max-w-md">
          Comienza a guardar reflexiones para ver tus estadísticas y patrones de
          crecimiento personal.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ====================================================================== */}
      {/* OVERVIEW CARDS */}
      {/* ====================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Reflections */}
        <OverviewCard
          icon={Heart}
          label="Reflexiones"
          value={summary.totalReflections}
          color="text-chakana-sage"
        />

        {/* Current Streak */}
        <OverviewCard
          icon={Flame}
          label="Racha Actual"
          value={`${summary.currentStreak} días`}
          color="text-chakana-gold"
        />

        {/* Longest Streak */}
        <OverviewCard
          icon={Award}
          label="Racha Máxima"
          value={`${summary.longestStreak} días`}
          color="text-chakana-mint"
        />

        {/* Days Active */}
        <OverviewCard
          icon={Calendar}
          label="Días Activos"
          value={summary.daysActive}
          color="text-purple-400"
        />
      </div>

      {/* ====================================================================== */}
      {/* CATEGORY BREAKDOWN PIE CHART */}
      {/* ====================================================================== */}
      {summary.categoriesBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-chakana-sage" />
            Categorías Favoritas
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.categoriesBreakdown}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ category, percentage }) =>
                  `${category} (${percentage}%)`
                }
              >
                {summary.categoriesBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#888'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#8FBC8F' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {summary.categoriesBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                />
                <span className="text-sm text-white/70">
                  {cat.category} ({cat.count})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ====================================================================== */}
      {/* ACTIVITY TIMELINE */}
      {/* ====================================================================== */}
      {summary.dailyActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-chakana-mint" />
            Actividad (Últimos 30 Días)
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={summary.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getDate()}/${date.getMonth() + 1}`
                }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#8FBC8F' }}
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                  })
                }}
              />
              <Line
                type="monotone"
                dataKey="reflections"
                stroke="#8FBC8F"
                strokeWidth={2}
                dot={{ fill: '#8FBC8F', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ====================================================================== */}
      {/* TOP TAGS & AUTHORS */}
      {/* ====================================================================== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Tags */}
        {summary.topTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-chakana-gold" />
              Etiquetas Más Usadas
            </h3>

            <div className="space-y-3">
              {summary.topTags.map((tag, index) => (
                <div key={tag.tag} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chakana-gold/20 flex items-center justify-center text-chakana-gold text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 font-medium">#{tag.tag}</span>
                      <span className="text-white/40 text-sm">{tag.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-chakana-gold to-chakana-mint rounded-full"
                        style={{
                          width: `${(tag.count / summary.topTags[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Authors */}
        {summary.topAuthors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Autores Favoritos
            </h3>

            <div className="space-y-3">
              {summary.topAuthors.map((author, index) => (
                <div key={author.author} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 font-medium text-sm">
                        {author.author}
                      </span>
                      <span className="text-white/40 text-sm">{author.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{
                          width: `${(author.count / summary.topAuthors[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* INSIGHTS */}
      {/* ====================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-chakana-sage/20 to-chakana-mint/20 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          ✨ Insights Personales
        </h3>

        <div className="space-y-2 text-white/70 text-sm">
          {summary.favoriteCategory && (
            <p>
              • Tu categoría favorita es{' '}
              <span className="text-chakana-sage font-semibold">
                {summary.favoriteCategory}
              </span>
            </p>
          )}

          {summary.favoriteAuthor && (
            <p>
              • Tu autor favorito es{' '}
              <span className="text-chakana-mint font-semibold">
                {summary.favoriteAuthor}
              </span>
            </p>
          )}

          {summary.averageNoteLength > 0 && (
            <p>
              • Escribes notas de{' '}
              <span className="text-chakana-gold font-semibold">
                ~{summary.averageNoteLength} caracteres
              </span>{' '}
              en promedio
            </p>
          )}

          {summary.currentStreak >= 3 && (
            <p className="text-chakana-gold font-semibold">
              🔥 ¡Excelente! Llevas {summary.currentStreak} días consecutivos
              reflexionando
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Overview Card Component
 */
interface OverviewCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}

function OverviewCard({ icon: Icon, label, value, color }: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all"
    >
      <Icon className={`w-8 h-8 ${color} mb-2`} />
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-white/60 uppercase tracking-wide">{label}</p>
    </motion.div>
  )
}
