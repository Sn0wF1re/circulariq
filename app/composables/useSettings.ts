// Composable: useSettings
// Fetches and updates settings for a company
// Usage: const { settings, error, loading, refetch, updateSettings } = useSettings(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface CompanySettings {
  id: string
  company_id: string
  notifications_enabled: boolean
  theme: string
  language: string
  timezone: string
  logo_url: string
  created_at: string
  updated_at: string
}

interface UseSettingsOptions {
  companyId: string
  useMock?: boolean
}

type UseSettingsReturn = {
  settings: ShallowRef<CompanySettings | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
  updateSettings: (patch: Partial<CompanySettings>) => Promise<void>
}

// Mock data
const mockSettings: CompanySettings = {
  id: 'settings1',
  company_id: 'mock-company',
  notifications_enabled: true,
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  logo_url: 'https://mock-company.com/logo.png',
  created_at: '2025-06-01T10:00:00Z',
  updated_at: '2025-07-01T10:00:00Z',
}

// Simple in-memory cache by companyId
const settingsCache = new Map<string, CompanySettings>()

export function useSettings(
  supabase: SupabaseClient,
  options: UseSettingsOptions
): UseSettingsReturn {
  const settings = shallowRef<CompanySettings | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // Should we use mock data? True if explicitly requested or in development mode
  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    // On server, skip fetching unless using mock data
    if (!isClient && !useMock.value) return
    loading.value = true
    error.value = null

    // Use cache if available and not using mock data
    if (!useMock.value && settingsCache.has(options.companyId)) {
      settings.value = settingsCache.get(options.companyId)!
      loading.value = false
      return
    }

    // Use mock data if requested or in dev mode
    if (useMock.value) {
      settings.value = mockSettings
      loading.value = false
      return
    }

    let settingsData, settingsErr
    try {
      const { data, error: err } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', options.companyId)
        .single()
      if (err) throw err
      settingsData = data
      settings.value = settingsData || null
      if (settingsData) settingsCache.set(options.companyId, settingsData)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  async function updateSettings(patch: Partial<CompanySettings>) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('company_settings')
        .update(patch)
        .eq('company_id', options.companyId)
      if (err) throw err
      await fetchData()
    } catch (err: any) {
      error.value = err
    }
    loading.value = false
  }

  watch(() => options.companyId, () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    settings,
    error,
    loading,
    refetch: fetchData,
    updateSettings,
  }
}
