/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        navy: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          dark: '#020617',
          surface: '#0F172A',
          surface2: '#1E293B',
          border: '#334155',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F1F5F9',
          muted: '#F8FAFC',
          dark: '#0F172A',
          dark2: '#1E293B',
        },
        border: {
          DEFAULT: '#CBD5E1',
          light: '#E2E8F0',
          dark: '#334155',
        }
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 6px 16px rgba(15, 23, 42, 0.04)',
        'dark-subtle': '0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
        'dark-card': '0 1px 3px rgba(0, 0, 0, 0.4), 0 6px 16px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      }
    },
  },
  plugins: [],
}