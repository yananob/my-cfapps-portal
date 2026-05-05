import { describe, it, expect } from 'vitest'
import { cn } from '../src/lib/utils'

describe('cn', () => {
  it('combines class names correctly', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional classes', () => {
    expect(cn('a', true && 'b', false && 'c')).toBe('a b')
  })
})
