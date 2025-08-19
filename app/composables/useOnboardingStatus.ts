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
      .single()
    if (userError || !profile) {
      onboardingComplete.value = false
      error.value = userError?.message || 'User profile not found.'
      loading.value = false
      return
    }
    userProfile.value = profile
    onboardingComplete.value = !!profile.onboarding_complete

    // Fetch user_companies (role, company_id)
    const { data: userCompany, error: ucError } = await supabase
      .from('user_companies')
      .select('role, company_id')
      .eq('user_id', user.value.id)
      .single()
    if (ucError || !userCompany) {
      companyProfile.value = null
      userRole.value = 'owner'
      loading.value = false
      return
    }
    userRole.value = userCompany.role

    // Fetch company profile
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name, sector, region_id, regulation_profile_id, compliance_status')
      .eq('id', userCompany.company_id)
      .single()
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
