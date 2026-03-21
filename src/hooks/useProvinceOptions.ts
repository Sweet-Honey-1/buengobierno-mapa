// src/hooks/useProvinceOptions.ts
import { useQuery } from '@tanstack/react-query'
import { fetchProvinceOptions } from '../lib/api'

export function useProvinceOptions() {
  return useQuery({
    queryKey: ['geo-provincias'],
    queryFn: fetchProvinceOptions,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  })
}