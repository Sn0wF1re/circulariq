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

import { useAuditLog } from './useAuditLog'

export function useCompanies({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const companies = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCompanies() {
    if (useMock) {
      companies.value = [mockCompany]
      return
    }
    loading.value = true
    error.value = null
    try {
      if (!user.value) throw new Error('No user logged in')
      // Get all companies for this user, including role
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('company_id, role')
        .eq('user_id', user.value.id)
      if (userCompaniesError) throw userCompaniesError
      if (!userCompanies || userCompanies.length === 0) throw new Error('No companies found for user')

      // Fetch all company data
      const companyIds = userCompanies.map((uc: any) => uc.company_id)
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, sector, region_id, regulation_profile_id, updated_at')
        .in('id', companyIds)
      if (companyError) throw companyError

      // Fetch compliance scores for all companies
      const { data: scoresData, error: scoresError } = await supabase
        .from('compliance_scores')
        .select('company_id, overall_score')
        .in('company_id', companyIds)
      // Map scores by company_id
      const scoresMap = (scoresData || []).reduce((acc: any, score: any) => {
        acc[score.company_id] = score
        return acc
      }, {})

      // Merge company data, user role, and compliance score
      companies.value = companyData.map((c: any) => {
        const userCompany = userCompanies.find((uc: any) => uc.company_id === c.id)
        return {
          ...c,
          role: userCompany?.role || 'member',
          compliance_score: scoresMap[c.id] || { overall_score: 0, regulations_met: 0, total_regulations: 0 }
        }
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch companies'
      companies.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCompanies)

  // Add a new company and link user as owner
  async function addCompany(company: any) {
    loading.value = true
    error.value = null
    try {
      // 1. Insert company
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: company.name,
          sector: company.sector,
          region_id: company.region_id,
          regulation_profile_id: company.regulation_profile_id
        }])
        .select()
        .maybeSingle()
      if (companyError) throw companyError
      // 2. Link user as owner
      const { error: linkError } = await supabase
        .from('user_companies')
        .insert([{
          user_id: user.value.id,
          company_id: newCompany.id,
          role: 'owner'
        }])
      if (linkError) throw linkError
      // 3. Audit log
      await useAuditLog({
        action: 'add_company',
        target_id: newCompany.id,
        target_table: 'companies',
        meta: company
      })
      // 4. Refresh companies
      await fetchCompanies()
      return { error: null, company: newCompany }
    } catch (e: any) {
      error.value = e.message || 'Failed to add company'
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    companies,
    loading,
    error,
    refresh: fetchCompanies,
    addCompany
  }
}
