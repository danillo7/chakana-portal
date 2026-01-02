import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { getInitials } from '../lib/utils'
import { MapPin, Mail, Linkedin, Instagram, Globe } from 'lucide-react'

export function TeamPage() {
  const { t } = useTranslation()
  const { stakeholders } = useDataStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('stakeholders.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('stakeholders.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholders.map((person) => (
          <Card key={person.id} className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-chakana-earth to-chakana-earth-light" />
            <CardContent className="pt-0 -mt-10">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-chakana-gold border-4 border-card flex items-center justify-center text-chakana-earth-dark text-xl font-bold">
                  {getInitials(person.name)}
                </div>

                {/* Name & Role */}
                <h3 className="font-display font-semibold text-lg mt-3">{person.name}</h3>
                <p className="text-sm text-chakana-earth">{person.role}</p>
                {person.company && (
                  <p className="text-xs text-muted-foreground">{person.company}</p>
                )}

                {/* Location */}
                {person.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" />
                    {person.location}
                  </div>
                )}

                {/* Bio */}
                {person.bio && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                    {person.bio}
                  </p>
                )}

                {/* Expertise */}
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {person.expertise.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border w-full justify-center">
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="text-muted-foreground hover:text-chakana-earth transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {person.socialLinks?.linkedin && (
                    <a
                      href={person.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-chakana-sky transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {person.socialLinks?.instagram && (
                    <a
                      href={person.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-pink-500 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {person.socialLinks?.website && (
                    <a
                      href={person.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-chakana-earth transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
