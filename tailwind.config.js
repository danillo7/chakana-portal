/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Chakana Brand Colors - from Logo
        chakana: {
          // Primary: Mint Green (logo background)
          mint: '#D4E4E1',
          'mint-light': '#E8F0EE',
          'mint-dark': '#B8CFC9',
          'mint-50': '#F5FAF9',
          'mint-100': '#E8F0EE',
          'mint-200': '#D4E4E1',
          'mint-300': '#B8CFC9',
          'mint-400': '#9BBAB2',
          'mint-500': '#7EA59B',

          // Secondary: Chakana Dark (logo symbol)
          dark: '#1A1A1A',
          'dark-light': '#2D2D2D',
          'dark-medium': '#404040',
          'dark-soft': '#525252',

          // Accent: Andean Gold (complementary)
          gold: '#C5A54A',
          'gold-light': '#D4B85E',
          'gold-dark': '#A68B3D',

          // Andean Green (nature/mountain)
          sage: '#4A7C59',
          'sage-light': '#5E9370',
          'sage-dark': '#3A6147',

          // Earth tones (Andes inspired)
          earth: '#8B7355',
          terracotta: '#C67B5C',

          // Legacy Navy (for dark mode)
          navy: '#223645',
          'navy-light': '#2D4558',
          'navy-dark': '#192833',

          // Status colors
          emerald: '#059669',
          amber: '#D97706',
          rose: '#E11D48',
          azure: '#0284C7',
        },
        // shadcn/ui compatible tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(26, 26, 26, 0.06), 0 2px 8px -2px rgba(26, 26, 26, 0.03)',
        'premium-lg': '0 10px 40px -4px rgba(26, 26, 26, 0.10), 0 4px 16px -4px rgba(26, 26, 26, 0.06)',
        'premium-xl': '0 20px 60px -8px rgba(26, 26, 26, 0.14), 0 8px 24px -8px rgba(26, 26, 26, 0.10)',
        'mint-glow': '0 4px 20px -2px rgba(212, 228, 225, 0.5)',
        'sage-glow': '0 4px 20px -2px rgba(74, 124, 89, 0.25)',
        'gold-glow': '0 4px 20px -2px rgba(197, 165, 74, 0.25)',
        'dark-glow': '0 4px 20px -2px rgba(26, 26, 26, 0.35)',
        'inner-mint': 'inset 0 2px 4px 0 rgba(212, 228, 225, 0.15)',
      },
      backgroundImage: {
        'gradient-mint': 'linear-gradient(135deg, #D4E4E1 0%, #E8F0EE 50%, #D4E4E1 100%)',
        'gradient-sage': 'linear-gradient(135deg, #4A7C59 0%, #5E9370 50%, #4A7C59 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C5A54A 0%, #D4B85E 50%, #C5A54A 100%)',
        'gradient-premium': 'linear-gradient(135deg, #1A1A1A 0%, #4A7C59 100%)',
        'gradient-chakana': 'linear-gradient(135deg, #D4E4E1 0%, #4A7C59 100%)',
        'gradient-radial-mint': 'radial-gradient(ellipse at center, rgba(212, 228, 225, 0.3) 0%, transparent 70%)',
        'gradient-radial-sage': 'radial-gradient(ellipse at center, rgba(74, 124, 89, 0.15) 0%, transparent 70%)',
        'mesh-chakana': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L30 60M0 30L60 30M15 15L45 45M45 15L15 45\' stroke=\'%234A7C59\' stroke-opacity=\'0.03\' fill=\'none\'/%3E%3C/svg%3E")',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "pulse-sage": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(74, 124, 89, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(74, 124, 89, 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-sage": "pulse-sage 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
