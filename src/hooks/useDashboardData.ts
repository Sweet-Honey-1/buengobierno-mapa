import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '../lib/api'

export function useDashboardData() {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: false,
  })

  return {
    dashboard: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}