import { useEffect } from 'react'
import { wakeFastApi } from '../lib/api'

export function useWakeApi() {
  useEffect(() => {
    wakeFastApi()
  }, [])
}