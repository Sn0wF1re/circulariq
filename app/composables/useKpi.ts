import { ref, computed, shallowRef, onMounted, watch } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Kpi {
  plasticUsage: number
  recyclability: number
  co2e: number
  compliance: number
}

interface UseKpiOptions {
  companyId: string
  useMock?: boolean
}

type UseKpiReturn = {
  kpi: ShallowRef<Kpi | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock KPI data per company
const mockKpiData: Record<string, Kpi> = {
  'company-1': {
    plasticUsage: 2140,
    recyclability: 78,
    co2e: 5.3,
    compliance: 85,
  },
  'company-2': {
    plasticUsage: 1800,
    recyclability: 82,
    co2e: 4.7,
    compliance: 90,
  },
}

// In-memory cache by companyId
const kpiCache = new Map<string, Kpi>()

export function useKpi(
  supabase: SupabaseClient,
  options: UseKpiOptions
): UseKpiReturn {
  const kpi = shallowRef<Kpi | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // Should we use mock data? True if explicitly requested or in development mode
  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    // On server, skip fetching unless using mock data
    if (!isClient && !useMock.value) return
    loading.value = true
    error.value = null

    // Use cache if available and not using mock data
    if (!useMock.value && kpiCache.has(options.companyId)) {
      kpi.value = kpiCache.get(options.companyId)!
      loading.value = false
      return
    }

    // Use mock data if requested or in dev mode
    if (useMock.value) {
      kpi.value = mockKpiData[options.companyId] || {
        plasticUsage: 0,
        recyclability: 0,
        co2e: 0,
        compliance: 0,
      }
      loading.value = false
      return
    }

    let kpiData, kpiErr
    try {
      // Example: fetch from a kpi table, adjust as needed
      const { data, error: err } = await supabase
        .from('kpi')
        .select('*')
        .eq('company_id', options.companyId)
        .single()
      if (err) throw err
      kpiData = data
      kpi.value = kpiData || {
        plasticUsage: 0,
        recyclability: 0,
        co2e: 0,
        compliance: 0,
      }
      if (kpiData) kpiCache.set(options.companyId, kpiData)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  // Refetch when companyId changes
  watch(() => options.companyId, () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    kpi,
    error,
    loading,
    refetch: fetchData,
  }
}
