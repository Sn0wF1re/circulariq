import { ref, computed, onMounted } from 'vue'
// composables are auto-imported in Nuxt

// ---- 1. Mock Data ----
const mockKpi = {
  plasticUsage: 2140,
  recyclability: 78,
  co2e: 5.3,
  compliance: 85
}

export function useDashboardData({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const kpi = ref<any>(mockKpi)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchKpi(companyId: string) {
    if (useMock) {
      kpi.value = mockKpi
      return
    }
    loading.value = true
    error.value = null
    try {
      // Example: fetch KPIs from a view or aggregate table (customize as needed)
      // This is a placeholder; adjust to your actual Supabase schema
      const { data, error: kpiError } = await supabase
        .rpc('get_dashboard_kpis', { company_id: companyId })
      if (kpiError) throw kpiError
      kpi.value = data || mockKpi
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch dashboard KPIs'
      kpi.value = mockKpi
    } finally {
      loading.value = false
    }
  }

  return {
    kpi,
    loading,
    error,
    fetchKpi
  }
}
