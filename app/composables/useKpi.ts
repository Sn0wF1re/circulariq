import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockKpiData: Record<string, any> = {
  'company-1': {
    plasticUsage: 2140,
    recyclability: 78,
    co2e: 5.3,
    compliance: 85
  },
  'company-2': {
    plasticUsage: 1800,
    recyclability: 82,
    co2e: 4.7,
    compliance: 90
  }
}

export function useKpi(companyId: string, { useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const kpi = ref<any>(mockKpiData[companyId] || {
    plasticUsage: 0,
    recyclability: 0,
    co2e: 0,
    compliance: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchKpi() {
    if (useMock) {
      kpi.value = mockKpiData[companyId] || {
        plasticUsage: 0,
        recyclability: 0,
        co2e: 0,
        compliance: 0
      }
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
      kpi.value = data || (mockKpiData[companyId] || {
        plasticUsage: 0,
        recyclability: 0,
        co2e: 0,
        compliance: 0
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KPI data'
      kpi.value = mockKpiData[companyId] || {
        plasticUsage: 0,
        recyclability: 0,
        co2e: 0,
        compliance: 0
      }
    } finally {
      loading.value = false
    }
  }

  return { kpi, loading, error, fetchKpi }
}
