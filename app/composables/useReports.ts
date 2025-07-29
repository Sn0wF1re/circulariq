// Composable: useReports
// Fetches footprint reports for a company (optionally by product)
// Usage: const { reports, error, loading, refetch } = useReports(supabase, { companyId, productId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Report {
  id: string
  company_id: string
  product_id: string
  reporting_period: string
  total_plastic_kg: number
  emissions_co2e: number
  footprint_score: number
  // ...other fields
}

interface UseReportsOptions {
  companyId: string
  productId?: string
  useMock?: boolean
}

type UseReportsReturn = {
  reports: ShallowRef<Report[]>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockReports: Report[] = [
  { id: 'r1', company_id: 'mock-company', product_id: 'p1', reporting_period: '2025-07', total_plastic_kg: 100, emissions_co2e: 50, footprint_score: 80 },
  { id: 'r2', company_id: 'mock-company', product_id: 'p2', reporting_period: '2025-07', total_plastic_kg: 200, emissions_co2e: 120, footprint_score: 75 },
]

// Simple in-memory cache by companyId+productId
const reportsCache = new Map<string, Report[]>()

export function useReports(
  supabase: SupabaseClient,
  options: UseReportsOptions
): UseReportsReturn {
  const reports = shallowRef<Report[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  function cacheKey() {
    return options.companyId + (options.productId ? `:${options.productId}` : '')
  }

  async function fetchData() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    error.value = null

    // Caching
    if (!useMock.value && reportsCache.has(cacheKey())) {
      reports.value = reportsCache.get(cacheKey())!
      loading.value = false
      return
    }

    if (useMock.value) {
      reports.value = mockReports
      loading.value = false
      return
    }

    let reportData, reportErr
    try {
      let query = supabase
        .from('footprint_reports')
        .select('*')
        .eq('company_id', options.companyId)
      if (options.productId) {
        query = query.eq('product_id', options.productId)
      }
      ({ data: reportData, error: reportErr } = await query)
      if (reportErr) throw reportErr
      reports.value = reportData || []
      reportsCache.set(cacheKey(), reports.value)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  watch(() => [options.companyId, options.productId], () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    reports,
    error,
    loading,
    refetch: fetchData,
  }
}
