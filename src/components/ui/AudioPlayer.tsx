import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string
          width: string
          playerVars: Record<string, number | string>
          events: {
            onReady: (event: { target: YTPlayer }) => void
            onStateChange: (event: { data: number }) => void
            onError: (event: { data: number }) => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        BUFFERING: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  nextVideo: () => void
  previousVideo: () => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getPlayerState: () => number
  getVideoData: () => { title: string; author: string }
  destroy: () => void
}

// Chakana YouTube Playlist
const PLAYLIST_ID = 'PLZinYe74kVx3s4Ul7gsuVOa5uEgEJUh_-'

export function AudioPlayer() {
  const {
    audioPreferences,
    setAudioEnabled,
    setAudioVolume,
    setAudioMuted,
    setAudioInteracted
  } = useUIStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('')
  const [showUnmuteHint, setShowUnmuteHint] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false)

  // Load YouTube IFrame API
  useEffect(() => {
    if (!audioPreferences.isEnabled) return

    if (window.YT && window.YT.Player) {
      initPlayer()
      return
    }

    // Only add script if not already present
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = initPlayer
  }, [audioPreferences.isEnabled])

  const initPlayer = useCallback(() => {
    if (playerRef.current || hasInitializedRef.current) return
    hasInitializedRef.current = true

    // Create container if doesn't exist
    let container = document.getElementById('yt-player')
    if (!container) {
      container = document.createElement('div')
      container.id = 'yt-player'
      container.style.display = 'none'
      document.body.appendChild(container)
    }

    playerRef.current = new window.YT.Player('yt-player', {
      height: '0',
      width: '0',
      playerVars: {
        listType: 'playlist',
        list: PLAYLIST_ID,
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: (event) => {
          // Apply stored volume
          event.target.setVolume(audioPreferences.volume)

          // Start muted for autoplay (browser policy)
          event.target.mute()

          setIsReady(true)

          // Auto-play immediately
          event.target.playVideo()

          // Show unmute hint if user hasn't interacted before
          if (!audioPreferences.hasInteracted) {
            setShowUnmuteHint(true)
          } else if (!audioPreferences.isMuted) {
            // User has interacted before and wants sound - unmute
            event.target.unMute()
            event.target.setVolume(audioPreferences.volume)
          }
        },
        onStateChange: (event) => {
          const playing = event.data === window.YT.PlayerState.PLAYING
          setIsPlaying(playing)

          if (playing) {
            try {
              const data = playerRef.current?.getVideoData()
              if (data?.title) {
                setCurrentTrack(data.title)
              }
            } catch {
              // Ignore errors getting track info
            }
          }
        },
        onError: () => {
          console.log('YouTube player error - music unavailable')
        },
      },
    })
  }, [audioPreferences.volume, audioPreferences.hasInteracted, audioPreferences.isMuted])

  // Handle outside click to collapse
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle first user interaction to unmute
  const handleUnmute = useCallback(() => {
    if (!playerRef.current) return

    playerRef.current.unMute()
    playerRef.current.setVolume(audioPreferences.volume)
    setAudioMuted(false)
    setAudioInteracted()
    setShowUnmuteHint(false)
  }, [audioPreferences.volume, setAudioMuted, setAudioInteracted])

  const togglePlay = () => {
    if (!playerRef.current) return

    // If showing unmute hint, first unmute
    if (showUnmuteHint) {
      handleUnmute()
    }

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
      // Also unmute if was muted
      if (audioPreferences.isMuted) {
        handleUnmute()
      }
    }
  }

  const nextTrack = () => {
    playerRef.current?.nextVideo()
  }

  const prevTrack = () => {
    playerRef.current?.previousVideo()
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setAudioVolume(newVolume)
    playerRef.current?.setVolume(newVolume)

    if (newVolume > 0 && audioPreferences.isMuted) {
      playerRef.current?.unMute()
      setAudioMuted(false)
    }

    // First interaction
    if (!audioPreferences.hasInteracted) {
      setAudioInteracted()
      setShowUnmuteHint(false)
    }
  }

  const toggleMute = () => {
    if (!playerRef.current) return

    // First interaction - unmute and mark as interacted
    if (showUnmuteHint || !audioPreferences.hasInteracted) {
      handleUnmute()
      return
    }

    if (audioPreferences.isMuted) {
      playerRef.current.unMute()
      playerRef.current.setVolume(audioPreferences.volume || 50)
      setAudioMuted(false)
    } else {
      playerRef.current.mute()
      setAudioMuted(true)
    }
  }

  const toggleEnabled = () => {
    if (audioPreferences.isEnabled) {
      playerRef.current?.pauseVideo()
      setAudioEnabled(false)
    } else {
      setAudioEnabled(true)
      // Player will be re-initialized by useEffect
    }
  }

  // Don't render if disabled
  if (!audioPreferences.isEnabled) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleEnabled}
          className="w-10 h-10 rounded-full bg-chakana-dark/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-chakana-dark/80 transition-all group"
          title="Activar música ambiente"
        >
          <Music className="w-4 h-4 text-white/30 group-hover:text-white/60" />
        </button>
      </div>
    )
  }

  if (!isReady) {
    return (
      <>
        <div id="yt-player" className="hidden" />
        {/* Loading indicator */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="w-10 h-10 rounded-full bg-chakana-dark/80 backdrop-blur-xl border border-white/10 flex items-center justify-center animate-pulse">
            <Music className="w-4 h-4 text-chakana-sage/50" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Hidden YouTube Player */}
      <div id="yt-player" className="hidden absolute -left-[9999px]" />

      {/* Premium Audio Controls */}
      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out"
      >
        {/* Unmute hint - shows pulse animation when playing but muted */}
        {showUnmuteHint && isPlaying && (
          <div
            className="absolute bottom-full right-0 mb-3 whitespace-nowrap animate-bounce"
          >
            <button
              onClick={handleUnmute}
              className="px-3 py-2 rounded-xl bg-chakana-sage text-white text-xs font-medium shadow-lg shadow-chakana-sage/30 hover:bg-chakana-sage-dark transition-colors flex items-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Haz clic para activar el sonido
            </button>
          </div>
        )}

        <div className={`
          flex items-center gap-2 p-2 rounded-2xl
          bg-chakana-dark/90 backdrop-blur-xl
          border border-white/10 shadow-2xl shadow-black/20
          transition-all duration-300
          ${isExpanded ? 'pr-4' : ''}
          ${showUnmuteHint && isPlaying ? 'ring-2 ring-chakana-sage/50 ring-offset-2 ring-offset-transparent' : ''}
        `}>
          {/* Collapsed: Just play button */}
          {!isExpanded ? (
            <div className="flex items-center gap-1">
              {/* Play/Pause - Main button */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-chakana-sage/20 hover:bg-chakana-sage/30 flex items-center justify-center transition-all group relative"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-chakana-sage group-hover:scale-110 transition-transform" />
                ) : (
                  <Play className="w-4 h-4 text-chakana-sage group-hover:scale-110 transition-transform ml-0.5" />
                )}

                {/* Playing indicator */}
                {isPlaying && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-chakana-sage animate-pulse" />
                )}
              </button>

              {/* Expand button with mute indicator */}
              <button
                onClick={() => setIsExpanded(true)}
                className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all group"
                title="Controles de audio"
              >
                {audioPreferences.isMuted || showUnmuteHint ? (
                  <VolumeX className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" />
                )}
              </button>
            </div>
          ) : (
            /* Expanded: Full controls */
            <div className="flex items-center gap-3">
              {/* Previous */}
              <button
                onClick={prevTrack}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all group"
                title="Anterior"
              >
                <SkipBack className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-chakana-sage/20 hover:bg-chakana-sage/30 flex items-center justify-center transition-all group"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-chakana-sage group-hover:scale-110 transition-transform" />
                ) : (
                  <Play className="w-4 h-4 text-chakana-sage group-hover:scale-110 transition-transform ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all group"
                title="Siguiente"
              >
                <SkipForward className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-white/10" />

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all group"
                  title={audioPreferences.isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {audioPreferences.isMuted || showUnmuteHint ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
                  )}
                </button>

                {/* Volume Slider */}
                <div className="relative w-20 h-8 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioPreferences.isMuted ? 0 : audioPreferences.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:h-3
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-chakana-sage
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-125
                      [&::-moz-range-thumb]:w-3
                      [&::-moz-range-thumb]:h-3
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-chakana-sage
                      [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(74, 124, 89) 0%, rgb(74, 124, 89) ${audioPreferences.isMuted ? 0 : audioPreferences.volume}%, rgba(255,255,255,0.1) ${audioPreferences.isMuted ? 0 : audioPreferences.volume}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Disable audio button */}
              <button
                onClick={toggleEnabled}
                className="w-6 h-6 rounded-md hover:bg-red-500/10 flex items-center justify-center transition-all ml-1 group"
                title="Desactivar música"
              >
                <span className="text-white/30 text-xs group-hover:text-red-400">×</span>
              </button>

              {/* Collapse button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center transition-all"
                title="Minimizar"
              >
                <span className="text-white/30 text-xs">−</span>
              </button>
            </div>
          )}
        </div>

        {/* Track info tooltip - shows on hover when playing */}
        {isPlaying && currentTrack && !showUnmuteHint && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-chakana-dark/90 backdrop-blur-xl border border-white/10 max-w-[200px] opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-xs text-white/60 truncate">{currentTrack}</p>
          </div>
        )}
      </div>
    </>
  )
}
