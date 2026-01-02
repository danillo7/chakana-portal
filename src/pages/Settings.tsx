import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useUIStore } from '../stores/uiStore'
import { languages } from '../lib/i18n'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useUIStore()

  const themes = [
    { id: 'light', icon: Sun, label: t('settings.themes.light') },
    { id: 'dark', icon: Moon, label: t('settings.themes.dark') },
    { id: 'system', icon: Monitor, label: t('settings.themes.system') },
  ] as const

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('settings.title')}
        </h1>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language')}</CardTitle>
          <CardDescription>
            Selecciona tu idioma preferido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={i18n.language === lang.code ? 'chakana' : 'outline'}
                className="justify-start gap-2"
                onClick={() => i18n.changeLanguage(lang.code)}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {i18n.language === lang.code && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.theme')}</CardTitle>
          <CardDescription>
            Personaliza la apariencia del portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <Button
                  key={themeOption.id}
                  variant={theme === themeOption.id ? 'chakana' : 'outline'}
                  className="justify-start gap-2"
                  onClick={() => setTheme(themeOption.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{themeOption.label}</span>
                  {theme === themeOption.id && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>Acerca de</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Chakana Portal</strong> v1.0.0</p>
          <p>Plataforma de gestión de proyectos para la alianza estratégica entre Dr. Danillo Costa y Iván Silva.</p>
          <p className="pt-2">
            © 2026 Costa Law & Chakana La Experiencia
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
