import '@fontsource/roboto/latin-300.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import { createAppQueryClient } from '@/app/query-client'
import { createAppRouter } from '@/app/router'

const rootElement = document.getElementById('root')

if (rootElement === null) {
  throw new Error('Application root element was not found')
}

const queryClient = createAppQueryClient()
const router = createAppRouter()

createRoot(rootElement).render(
  <StrictMode>
    <App queryClient={queryClient} router={router} />
  </StrictMode>,
)
