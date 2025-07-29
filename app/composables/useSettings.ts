import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockSettings = {
  company: {
    name: 'EcoTech Solutions',
    sector: 'Technology',
    region: 'North America',
    regulation_profile: 'EU Packaging',
    compliance_status: 'Compliant',
  },
  account: {
    full_name: 'John Smith',
    email: 'john.smith@ecotech.com',
    phone: '+1 (555) 123-4567',
    timezone: 'utc',
  },
  privacy: {
    analytics: true,
    marketing: false,
  },
  api: {
    key: 'pk_test_51J...',
    connected_apps: [
      { name: 'Salesforce', status: 'connected' },
      { name: 'SAP', status: 'disconnected' },
    ],
  },
}

export function useSettings({ useMock = false, companyId = null } = {}) {
  const supabase = useSupabaseClient()
  const settings = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    if (useMock) {
      settings.value = mockSettings
      return
    }
    loading.value = true
    error.value = null
    try {
      // Example: fetch company settings from Supabase
      const { data, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyId)
        .single()
      if (settingsError) throw settingsError
      settings.value = data || mockSettings
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch settings.'
      settings.value = mockSettings
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(patch: any) {
    loading.value = true
    error.value = null
    try {
      if (useMock) {
        settings.value = { ...settings.value, ...patch }
        return
      }
      const { error: updateError } = await supabase
        .from('company_settings')
        .update(patch)
        .eq('company_id', companyId)
      if (updateError) throw updateError
      await fetchSettings()
    } catch (e: any) {
      error.value = e.message || 'Failed to update settings.'
    } finally {
      loading.value = false
    }
  }

  // Optionally, fetch on composable use
  fetchSettings()

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    updateSettings,
  }
}
