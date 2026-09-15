import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import listFixture from '@/test/fixtures/nws-alert-list.json'

export const server = setupServer(
  http.get('https://api.weather.gov/alerts', () =>
    HttpResponse.json(listFixture),
  ),
)
