import { ref, computed, onMounted } from 'vue'
// composables are auto-imported in Nuxt

// ---- 1. Mock Data (matches companies schema) ----
const mockCompanies = [
  {
    id: '1',
    name: 'EcoTech Solutions',
    sector: 'Technology',
    region_id: 'mock-region-uuid-1',
    regulation_profile_id: 'mock-regulation-profile-uuid-1',
    compliance_score: {
      overall_score: 92,
      regulations_met: 11,
      total_regulations: 12
    }
  },
  {
    id: '2',
    name: 'GreenPack Industries',
    sector: 'Packaging',
    region_id: 'mock-region-uuid-2',
    regulation_profile_id: 'mock-regulation-profile-uuid-2',
    compliance_score: {
      overall_score: 68,
      regulations_met: 7,
      total_regulations: 12
    }
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
      // Fetch companies
      const { data: companyData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, sector, region_id, regulation_profile_id')
      if (companiesError) throw companiesError
      // Fetch compliance scores for all companies
      const companyIds = (companyData || []).map(c => c.id)
      const { data: scoresData, error: scoresError } = await supabase
        .from('compliance_scores')
        .select('company_id, regulation_profile_id, overall_score, regulations_met, total_regulations')
        .in('company_id', companyIds)
      if (scoresError) throw scoresError
      // Map scores to companies
      const scoresMap = new Map()
      for (const score of scoresData || []) {
        scoresMap.set(score.company_id, score)
      }
      companies.value = (companyData || []).map(c => ({
        ...c,
        compliance_score: scoresMap.get(c.id) || { overall_score: 0, regulations_met: 0, total_regulations: 0 }
      }))
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
