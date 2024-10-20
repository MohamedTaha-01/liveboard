import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateWhiteboardCode = (code: string | undefined) =>
  !code || code.length < 1 ? true : false
