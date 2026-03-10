export const FORM_SIZE_MAP = {
  small:  { drawer: 480,  modal: 520 },
  medium: { drawer: 700,  modal: 720 },
  large:  { drawer: 1000, modal: 960 },
} as const

export type FormSizePreset = keyof typeof FORM_SIZE_MAP
