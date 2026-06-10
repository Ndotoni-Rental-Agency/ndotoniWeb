/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Ndotoni brand green — matches poster vibrant green
        brand: {
          50:  '#EEFBF3',
          100: '#D6F5E3',
          200: '#B0EBCB',
          300: '#7ADEA9',
          400: '#3DCC7E',
          500: '#1DBF53',  // poster primary green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Cream neutrals — poster uses clean white/off-white
        cream: {
          50:  '#FFFFFF',
          100: '#FAFBFC',
          200: '#F3F4F6',
          300: '#E5E7EB',
          400: '#9CA3AF',
        },
        // Ink — text colors
        ink: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          300: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Clay → maps to brand green (accent for badges/tags)
        clay: {
          50:  '#EEFBF3',
          100: '#D6F5E3',
          200: '#B0EBCB',
          300: '#7ADEA9',
          400: '#3DCC7E',
          500: '#1DBF53',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Secondary — rose/pink accent
        secondary: {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        sand: {
          50:  '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
        },
        stone: {
          50:  '#FAFBFC',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft:       '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        editorial:  '0 4px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)',
        green:      '0 8px 32px rgba(29,191,83,0.20)',
        'green-sm': '0 2px 12px rgba(29,191,83,0.15)',
        'green-lg': '0 12px 48px rgba(29,191,83,0.25)',
        rose:       '0 8px 32px rgba(244,63,94,0.20)',
        'rose-sm':  '0 2px 12px rgba(244,63,94,0.15)',
        hero:       '0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)',
      },
      screens: {
        'xs': '475px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brand-gradient':  'linear-gradient(135deg, #1DBF53 0%, #16A34A 100%)',
        'brand-radial':    'radial-gradient(circle at 30% 50%, #1DBF53 0%, #16A34A 100%)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
