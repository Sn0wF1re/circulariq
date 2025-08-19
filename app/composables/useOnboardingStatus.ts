import { ref } from 'vue'

export function useOnboardingStatus() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref('')
  const onboardingComplete = ref(false)
  const userProfile = ref<any>(null)
  const companyProfile = ref<any>(null)
  const userRole = ref('owner')

  async function fetchStatus() {
    if (!user.value) return
    loading.value = true
    error.value = ''
    // Fetch user profile (onboarding_complete, names)
    const { data: profile, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, onboarding_complete')
      .eq('id', user.value.id)
      .maybeSingle()
    if (userError || !profile) {
      onboardingComplete.value = false
      error.value = userError?.message || 'User profile not found.'
      loading.value = false
      return
    }
    userProfile.value = profile
    onboardingComplete.value = !!profile.onboarding_complete

    // Fetch user_companies (role, company_id) - allow zero rows for new users
    const { data: userCompany, error: ucError } = await supabase
      .from('user_companies')
      .select('role, company_id')
      .eq('user_id', user.value.id)
      .maybeSingle()
    if (ucError) {
      error.value = ucError.message || 'Error fetching user-company relationship.'
      companyProfile.value = null
      userRole.value = 'owner'
      loading.value = false
      return
    }
    if (!userCompany) {
      // New user, not yet linked to a company
      companyProfile.value = null
      userRole.value = 'owner'
      loading.value = false
      return
    }
    userRole.value = userCompany.role

    // Fetch company profile - allow zero rows if company is missing
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name, sector, region_id, regulation_profile_id, compliance_status')
      .eq('id', userCompany.company_id)
      .maybeSingle()
    if (companyError) {
      error.value = companyError.message || 'Error fetching company profile.'
      companyProfile.value = null
      loading.value = false
      return
    }
    companyProfile.value = company || null
    loading.value = false
  }

  return {
    onboardingComplete,
    userProfile,
    companyProfile,
    userRole,
    loading,
    error,
    fetchStatus,
  }
}
