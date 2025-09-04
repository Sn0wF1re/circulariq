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
  const trendData = ref<any[]>([])
  const alerts = ref<any[]>([])

  async function fetchKpi(companyId: string) {
    if (useMock) {
      kpi.value = mockKpi
      trendData.value = [
        { period: '2025-05-01', plastic: 2000, co2e: 4.8 },
        { period: '2025-06-01', plastic: 2100, co2e: 5.0 },
        { period: '2025-07-01', plastic: 2200, co2e: 5.2 },
        { period: '2025-08-01', plastic: 2140, co2e: 5.3 }
      ]
      alerts.value = [
        { id: 1, message: 'Compliance deadline approaching', date: '2025-08-28' },
        { id: 2, message: 'Plastic usage increased by 5%', date: '2025-08-15' }
      ]
      return
    }
    loading.value = true
    error.value = null
    try {
      // 1. Get latest reporting period for this company
      const { data: latestPeriodData, error: periodError } = await supabase
        .from('footprint_reports')
        .select('reporting_period')
        .eq('company_id', companyId)
        .order('reporting_period', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (periodError) throw periodError
      const latestPeriod = latestPeriodData?.reporting_period
      if (!latestPeriod) throw new Error('No footprint data for this company')

      // 2. Aggregate footprint_reports for this period
      const { data: footprintAgg, error: aggError } = await supabase
        .from('footprint_reports')
        .select('total_plastic_kg, emissions_co2e, footprint_score')
        .eq('company_id', companyId)
        .eq('reporting_period', latestPeriod)
      if (aggError) throw aggError

      // Calculate sums/averages
      const totalPlastic = footprintAgg?.reduce((sum, r) => sum + (Number(r.total_plastic_kg) || 0), 0) || 0
      const totalCo2e = footprintAgg?.reduce((sum, r) => sum + (Number(r.emissions_co2e) || 0), 0) || 0
      const avgFootprintScore = footprintAgg && footprintAgg.length > 0
        ? Math.round(footprintAgg.reduce((sum, r) => sum + (Number(r.footprint_score) || 0), 0) / footprintAgg.length)
        : 0

      // 3. Get compliance score for this company
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_scores')
        .select('overall_score')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (complianceError) throw complianceError
      const compliance = complianceData?.overall_score ? Math.round(Number(complianceData.overall_score)) : 0

      kpi.value = {
        plasticUsage: totalPlastic,
        recyclability: avgFootprintScore,
        co2e: Number((totalCo2e / 1000).toFixed(2)), // tons
        compliance
      }

      // 4. Trend data: aggregate by reporting_period (last 6 months)
      const { data: trendRows, error: trendError } = await supabase
        .from('footprint_reports')
        .select('reporting_period, total_plastic_kg, emissions_co2e')
        .eq('company_id', companyId)
        .order('reporting_period', { ascending: true })
      if (trendError) throw trendError
      // Group by period
      const periodMap: Record<string, { plastic: number, co2e: number }> = {}
      for (const row of trendRows || []) {
        const period = row.reporting_period
        if (!periodMap[period]) periodMap[period] = { plastic: 0, co2e: 0 }
        periodMap[period].plastic += Number(row.total_plastic_kg) || 0
        periodMap[period].co2e += Number(row.emissions_co2e) || 0
      }
      trendData.value = Object.entries(periodMap).map(([period, vals]) => ({ period, ...vals }))

      // 5. Recent alerts (last 5 notifications)
      const { data: alertRows, error: alertError } = await supabase
        .from('notifications')
        .select('id, message, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (alertError) throw alertError
      alerts.value = (alertRows || []).map(a => ({ id: a.id, message: a.message, date: a.created_at }))
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch dashboard KPIs'
      kpi.value = mockKpi
      trendData.value = []
      alerts.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    kpi,
    loading,
    error,
    fetchKpi,
    trendData,
    alerts
  }
}
