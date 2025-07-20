import { ref, computed } from 'vue'

export function useKpi(companyId: string) {
  // Mock KPI data per company
  const kpiData = {
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
    // Add more mock companies as needed
  }

  const kpi = computed(() => {
    return kpiData[companyId] || {
      plasticUsage: 0,
      recyclability: 0,
      co2e: 0,
      compliance: 0
    }
  })

  return { kpi }
}
