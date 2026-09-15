import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from '@/test/server'

const HostDateTimeFormat = Intl.DateTimeFormat

function DateTimeFormatWithTestLocale(
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return new HostDateTimeFormat(locales ?? 'en-US', options)
}

Intl.DateTimeFormat = Object.assign(DateTimeFormatWithTestLocale, {
  supportedLocalesOf:
    HostDateTimeFormat.supportedLocalesOf.bind(HostDateTimeFormat),
}) as typeof Intl.DateTimeFormat

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
