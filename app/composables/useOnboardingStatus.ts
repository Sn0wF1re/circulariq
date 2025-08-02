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
    // Fetch user profile
    const { data: profile, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, onboarding_complete, role')
      .eq('id', user.value.id)
      .single()
    if (userError || !profile) {
      onboardingComplete.value = false
      error.value = userError?.message || 'User profile not found.'
      loading.value = false
      return
    }
    userProfile.value = profile
    userRole.value = profile.role || 'owner'
    onboardingComplete.value = !!profile.onboarding_complete
    // Fetch company profile
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, name, sector, region_id, regulation_profile_id, compliance_status, user_id')
      .eq('user_id', user.value.id)
      .single()
    if (companyError || !company) {
      companyProfile.value = null
      onboardingComplete.value = false
      loading.value = false
      return
    }
    companyProfile.value = company
    // Check required fields
    if (!profile.first_name || !profile.last_name) onboardingComplete.value = false
    if (!company.name || !company.sector || !company.region_id || !company.regulation_profile_id || !company.compliance_status) onboardingComplete.value = false
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
