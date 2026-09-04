/** Homepage hero mockup v2 — DigitalManager brand palette */
export const mockV2 = {
  navy: '#0B2347',
  coral: '#F26A4F',
  coralSoft: '#FF9A76',
  peach: '#FFF1EC',
  amber: '#F6B44C',
  page: '#F8FAFC',
  white: '#FFFFFF',
  cardHighlight: '#FFF7F3',
  border: '#E4EAF2',
  heading: '#0B2347',
  body: '#66758F',
  success: '#16A36A',
  warning: '#F6B44C',
  error: '#ef4444',
  /** @deprecated use coral */
  teal: '#F26A4F',
  /** @deprecated use coralSoft */
  blue: '#FF9A76',
  orange: '#F26A4F',
  orangeLight: '#FFF1EC',
} as const

export type TrendTone = 'positive' | 'neutral' | 'warning' | 'negative'
