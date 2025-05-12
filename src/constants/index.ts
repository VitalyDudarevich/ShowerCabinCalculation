export const GLASS_TYPES = {
  CLEAR: 'clear',
  ULTRA_CLEAR: 'ultra-clear',
  MATTE_SANDBLASTED: 'matte-sandblasted',
  MATTE_FACTORY: 'matte-factory',
  BRONZE: 'bronze',
  GRAPHITE_RUS: 'graphite-rus',
  GRAPHITE_IRAN: 'graphite-iran'
} as const;

export const GLASS_THICKNESS = {
  EIGHT: 8,
  TEN: 10
} as const;

export const GLASS_TYPE_TEXT = {
  [GLASS_TYPES.CLEAR]: 'прозрачное',
  [GLASS_TYPES.ULTRA_CLEAR]: 'осветленное',
  [GLASS_TYPES.MATTE_SANDBLASTED]: 'матовое пескоструй',
  [GLASS_TYPES.MATTE_FACTORY]: 'матовое производство',
  [GLASS_TYPES.BRONZE]: 'бронза',
  [GLASS_TYPES.GRAPHITE_RUS]: 'графит РФ',
  [GLASS_TYPES.GRAPHITE_IRAN]: 'графит Иран'
} as const; 