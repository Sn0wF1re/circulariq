import { ref, computed, onMounted } from 'vue'
// composables are auto-imported in Nuxt

// ---- 1. Mock Data (matches companies schema) ----
const mockCompanies = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    sector: 'Technology',
    region: 'North America',
    compliance_status: {
      overall_score: 85,
      regulations_met: 17,
      total_regulations: 20
    },
    regulation_profile: 'EU-US-CA',
  },
  {
    id: '2',
    name: 'GreenPack Industries',
    sector: 'Packaging',
    region: 'Europe',
    compliance_status: {
      overall_score: 92,
      regulations_met: 18,
      total_regulations: 20
    },
    regulation_profile: 'EU-UK',
  }
]

export function useCompliance({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const companies = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompanies() {
    if (useMock) {
      companies.value = mockCompanies
      return
    }
    loading.value = true
    error.value = null
    try {
      // Get all companies for the user (could be filtered by user)
      const { data, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, sector, region, compliance_status, regulation_profile')
      if (companiesError) throw companiesError
      companies.value = data || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch companies'
      companies.value = mockCompanies
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCompanies)

  const companiesToShow = computed(() => companies.value.length ? companies.value : mockCompanies)

  return {
    companies: companiesToShow,
    loading,
    error,
    refresh: fetchCompanies
  }
}
