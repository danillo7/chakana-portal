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
        // Official Chakana Brand Colors (from chakanalaexperiencia.es)
        chakana: {
          // Primary: Inca Gold
          gold: '#C5A54A',
          'gold-light': '#D4B85E',
          'gold-dark': '#A68B3D',
          'gold-50': '#FBF8F0',
          'gold-100': '#F5EDD8',
          'gold-200': '#EBD9B1',
          // Secondary: Deep Navy Blue
          navy: '#223645',
          'navy-light': '#2D4558',
          'navy-dark': '#192833',
          'navy-50': '#F0F4F7',
          'navy-100': '#D9E2E8',
          'navy-200': '#B3C5D1',
          // Accent colors for UI
          cream: '#FDF9F3',
          ivory: '#FFFEF9',
          bronze: '#8B6914',
          copper: '#B87333',
          // Status colors (refined)
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
        // Official Chakana font
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
        'premium': '0 4px 20px -2px rgba(34, 54, 69, 0.08), 0 2px 8px -2px rgba(34, 54, 69, 0.04)',
        'premium-lg': '0 10px 40px -4px rgba(34, 54, 69, 0.12), 0 4px 16px -4px rgba(34, 54, 69, 0.08)',
        'premium-xl': '0 20px 60px -8px rgba(34, 54, 69, 0.16), 0 8px 24px -8px rgba(34, 54, 69, 0.12)',
        'gold-glow': '0 4px 20px -2px rgba(197, 165, 74, 0.25)',
        'navy-glow': '0 4px 20px -2px rgba(34, 54, 69, 0.35)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(197, 165, 74, 0.06)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C5A54A 0%, #D4B85E 50%, #C5A54A 100%)',
        'gradient-navy': 'linear-gradient(135deg, #223645 0%, #2D4558 50%, #223645 100%)',
        'gradient-premium': 'linear-gradient(135deg, #223645 0%, #C5A54A 100%)',
        'gradient-radial-gold': 'radial-gradient(ellipse at center, rgba(197, 165, 74, 0.15) 0%, transparent 70%)',
        'mesh-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.656 28 0h.001zM33.656 0L41.142 7.485 39.728 8.9l-7.9-7.9h1.828zm5.656 0L46.798 7.485 45.384 8.9l-7.9-7.9h1.828zM.344 0L0 .344V0h.344zM0 5.373v-2.83L2.828 0H0v5.373zm0 5.656v-2.83L8.485 0H5.657L0 5.657v5.372zm0 5.656v-2.828L14.142 0h-2.828L0 11.314v5.371zm0 5.657v-2.83L19.8 0h-2.83L0 16.97v5.372zm0 5.657v-2.828L25.456 0h-2.828L0 22.628v5.372zm0 5.656v-2.828L31.113 0h-2.828L0 28.285v5.372zm0 5.657v-2.83L36.77 0h-2.83L0 33.942v5.37zm0 5.657v-2.828L42.427 0h-2.83L0 39.6v5.37zm0 5.657v-2.828L48.084 0h-2.83L0 45.256v5.372zm0 5.656V54.63L53.74 0h-2.828L0 50.913v5.372zM0 60v-3.372L59.398 0H60v.344L.344 60H0zm60 0v-5.373L5.373 60H60zm0-5.656v2.828L7.2 60h2.83L60 5.03v49.314zm0-5.656v2.828L12.857 60h2.83L60 10.687v38zM60 43.03V45.857L18.514 60h2.828L60 16.343v26.687zm0-5.656v2.828L24.17 60H27L60 21.999v15.374zm0-5.657v2.83L29.83 60h2.826L60 27.656v4.06zm0-5.656v2.828L35.484 60h2.83L60 33.313v-7.25zm0-5.657v2.83L41.142 60h2.828L60 38.97v-18.56zm0-5.656v2.828L46.8 60h2.827L60 44.627V14.746zm0-5.657v2.83L52.456 60h2.828L60 50.284V9.09zm0-5.656v2.827L58.113 60H60V3.43z\' fill=\'%23C5A54A\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
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
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(197, 165, 74, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(197, 165, 74, 0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
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
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
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
