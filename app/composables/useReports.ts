import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockReports = [
  {
    id: '1',
    product_id: '1',
    reporting_period: '2024-Q1',
    total_plastic_kg: 1250,
    emissions_co2e: 3.2,
    footprint_score: 78
  },
  {
    id: '2',
    product_id: '2',
    reporting_period: '2024-Q2',
    total_plastic_kg: 890,
    emissions_co2e: 2.1,
    footprint_score: 82
  }
]

export function useReports({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const reports = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchReports() {
    if (useMock) {
      reports.value = mockReports
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: reportsError } = await supabase.from('footprint_reports').select('*')
      if (reportsError) throw reportsError
      reports.value = data || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch reports.'
      reports.value = mockReports
    } finally {
      loading.value = false
    }
  }

  // Optionally, fetch on composable use
  fetchReports()

  return {
    reports,
    loading,
    error,
    refresh: fetchReports
  }
}
