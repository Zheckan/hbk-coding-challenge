import { useEffect, useState } from 'react'

const CURRENT_TIME_REFRESH_MS = 60_000

// Updates once a minute so expiry labels stay correct while the page is open.
export function useCurrentTime(): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, CURRENT_TIME_REFRESH_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return now
}
