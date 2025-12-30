/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue-500
        'primary-dark': '#2563EB', // Blue-600
        'primary-light': '#60A5FA', // Blue-400
        secondary: '#8B5CF6',
        success: '#10B981',
        // Modern glassmorphism palette
        'glass-bg': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(13, 17, 23, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.18)',
        'glass-border-dark': 'rgba(255, 255, 255, 0.08)',
        // GitHub-style dark mode colors (enhanced)
        'gh-dark-bg': '#0D1117',
        'gh-dark-surface': '#161B22',
        'gh-dark-elevated': '#1C2128',
        'gh-dark-text': '#E6EDF3',
        'gh-dark-text-secondary': '#8D96A0',
        'gh-dark-border': '#30363D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'elevated-dark': '0 4px 16px 0 rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
