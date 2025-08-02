
// ---- 1. Mock Data (matches Supabase schema) ----
const mockCompany = {
  id: 'mock-uuid',
  name: 'EcoTech Solutions',
  sector: 'Technology',
  region_id: 'mock-region-uuid',
  regulation_profile_id: 'mock-regulation-profile-uuid',
  updated_at: new Date().toISOString(),
  compliance_score: {
    overall_score: 92,
    regulations_met: 11,
    total_regulations: 12
  }
}

export function useCompanies({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const company = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getCompanyId() {
    if (!user.value) return null
    const { data, error } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.value.id)
      .single()
    return data?.company_id || null
  }

  async function fetchCompany() {
    if (useMock) {
      company.value = mockCompany
      return
    }
    loading.value = true
    error.value = null
    try {
      const companyId = await getCompanyId()
      if (!companyId) throw new Error('No company found for user')
      // Fetch company data
      const { data, error: companyError } = await supabase
        .from('companies')
        .select('id, name, sector, region_id, regulation_profile_id, updated_at')
        .eq('id', companyId)
        .single()
      if (companyError) throw companyError
      // Fetch compliance score for this company
      const { data: scoreData, error: scoreError } = await supabase
        .from('compliance_scores')
        .select('company_id, regulation_profile_id, overall_score, regulations_met, total_regulations')
        .eq('company_id', companyId)
        .single()
      if (scoreError) {
        // If no score, fallback to default
        company.value = { ...data, compliance_score: { overall_score: 0, regulations_met: 0, total_regulations: 0 } }
      } else {
        company.value = { ...data, compliance_score: scoreData }
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch company data'
      company.value = mockCompany
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCompany)

  const companyToShow = computed(() => company.value || mockCompany)

  return {
    company: companyToShow,
    loading,
    error,
    refresh: fetchCompany
  }
}
