import { describe, it, expect } from 'vitest'
import { groupServices, ServiceListItem } from '../src/lib/service-utils'

describe('groupServices', () => {
  it('groups services by base name correctly', () => {
    const services: ServiceListItem[] = [
      { name: 'app', url: 'https://app', logUrl: 'https://logs/app' },
      { name: 'app-test', url: 'https://app-test', logUrl: 'https://logs/app-test' },
      { name: 'app-event', url: 'https://app-event', logUrl: 'https://logs/app-event' },
      { name: 'app-test-event', url: 'https://app-test-event', logUrl: 'https://logs/app-test-event' },
      { name: 'other', url: 'https://other', logUrl: 'https://logs/other' },
    ]

    const repoMap = new Map([
      ['app', { repoUrl: 'https://github/app', issueUrl: 'https://github/app/issues', julesUrl: 'https://jules/app' }],
    ])

    const result = groupServices(services, repoMap)

    expect(result).toHaveLength(2)

    const appGroup = result.find(g => g.baseName === 'app')
    expect(appGroup).toBeDefined()
    expect(appGroup?.main?.url).toBe('https://app')
    expect(appGroup?.test?.url).toBe('https://app-test')
    expect(appGroup?.event?.url).toBe('https://app-event')
    expect(appGroup?.testEvent?.url).toBe('https://app-test-event')
    expect(appGroup?.repoUrl).toBe('https://github/app')

    const otherGroup = result.find(g => g.baseName === 'other')
    expect(otherGroup).toBeDefined()
    expect(otherGroup?.main?.url).toBe('https://other')
    expect(otherGroup?.repoUrl).toBeUndefined()
  })

  it('includes repositories without any associated services', () => {
    const services: ServiceListItem[] = []
    const repoMap = new Map([
      ['only-repo', { repoUrl: 'https://github/only-repo', issueUrl: 'https://github/only-repo/issues', julesUrl: 'https://jules/only-repo' }],
    ])

    const result = groupServices(services, repoMap)

    expect(result).toHaveLength(1)
    expect(result[0].baseName).toBe('only-repo')
    expect(result[0].repoUrl).toBe('https://github/only-repo')
    expect(result[0].main).toBeUndefined()
  })

  it('matches services with repo names using prefix matching', () => {
    const services: ServiceListItem[] = [
      { name: 'oml', url: 'https://oml', logUrl: 'https://logs/oml' },
      { name: 'oml-test', url: 'https://oml-test', logUrl: 'https://logs/oml-test' },
    ]
    const repoMap = new Map([
      ['oml-empowerd', { repoUrl: 'https://github/oml-empowerd', issueUrl: 'https://github/oml-empowerd/issues', julesUrl: 'https://jules/oml-empowerd' }],
    ])

    const result = groupServices(services, repoMap)

    expect(result).toHaveLength(1)
    expect(result[0].baseName).toBe('oml-empowerd')
    expect(result[0].main?.url).toBe('https://oml')
    expect(result[0].test?.url).toBe('https://oml-test')
  })

  it('sorts groups by base name', () => {
    const services: ServiceListItem[] = [
      { name: 'z-app', url: 'https://z', logUrl: 'https://logs/z' },
      { name: 'a-app', url: 'https://a', logUrl: 'https://logs/a' },
    ]
    const repoMap = new Map()

    const result = groupServices(services, repoMap)
    expect(result[0].baseName).toBe('a-app')
    expect(result[1].baseName).toBe('z-app')
  })
})
