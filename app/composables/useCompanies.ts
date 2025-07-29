
// ---- 1. Mock Data (matches Supabase schema) ----
const mockCompany = {
  id: 'mock-uuid',
  name: 'EcoTech Solutions',
  sector: 'Technology',
  region: 'North America',
  compliance_status: { status: 'Compliant' },
  regulation_profile: 'EU Packaging',
  updated_at: new Date().toISOString(),
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
      const { data, error: companyError } = await supabase
        .from('companies')
        .select('id, name, sector, region, compliance_status, regulation_profile, updated_at')
        .eq('id', companyId)
        .single()
      if (companyError) throw companyError
      company.value = data
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
