import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const languages = [
  { code: 'EN', name: 'English' },
  { code: 'NL', name: 'Nederlands' },
  { code: 'FR', name: 'Français' },
  { code: 'ES', name: 'Español' },
  { code: 'DE', name: 'Deutsch' },
] as const

export const categories = [
  { value: 'ALL', label: 'Alles' },
  { value: 'TECHNOLOGY', label: 'Technologie' },
  { value: 'GREEN_WORLD', label: 'Groene Wereld' },
  { value: 'HEALTH', label: 'Gezondheid' },
  { value: 'EDUCATION', label: 'Onderwijs' },
  { value: 'COMMUNITY', label: 'Gemeenschap' },
  { value: 'SPORT', label: 'Sport' },
] as const

export const regions = [
  { value: 'ALL', label: 'Alle Regio\'s' },
  { value: 'EUROPE', label: 'Europa' },
  { value: 'NORTH_AMERICA', label: 'Noord-Amerika' },
  { value: 'SOUTH_AMERICA', label: 'Zuid-Amerika' },
  { value: 'ASIA', label: 'Azië' },
  { value: 'AFRICA', label: 'Afrika' },
  { value: 'OCEANIA', label: 'Oceanië' },
] as const
