export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'apple-blue':      '#0066cc',
        'apple-blue-focus':'#0071e3',
        'apple-blue-dark': '#2997ff',
        'apple-ink':       '#1d1d1f',
        'apple-ink-80':    '#333333',
        'apple-ink-48':    '#7a7a7a',
        'apple-parchment': '#f5f5f7',
        'apple-pearl':     '#fafafc',
        'apple-hairline':  '#e0e0e0',
        'apple-divider':   '#f0f0f0',
        'apple-chip':      '#d2d2d7',
        'apple-tile-1':    '#272729',
        'apple-tile-2':    '#2a2a2c',
        'apple-tile-3':    '#252527',
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '11px',
        'apple-lg': '18px',
      },
      fontSize: {
        'apple-hero':    ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px',  fontWeight: '600' }],
        'apple-display': ['40px', { lineHeight: '1.10', letterSpacing: '0',        fontWeight: '600' }],
        'apple-tagline': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'apple-body':    ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
        'apple-caption': ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
        'apple-nav':     ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px',  fontWeight: '400' }],
        'apple-fine':    ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px',  fontWeight: '400' }],
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
