// Composable: useCompliance
// Fetches company compliance data
// Usage: const { compliance, error, loading, refetch } = useCompliance(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Compliance {
  id: string
  name: string
  sector: string
  region: string
  compliance_status: any
  regulation_profile: string
  // ...other fields
}

interface UseComplianceOptions {
  companyId: string
  useMock?: boolean
}

type UseComplianceReturn = {
  compliance: ShallowRef<Compliance | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockCompliance: Compliance = {
  id: 'mock-company',
  name: 'Mock Company',
  sector: 'Packaging',
  region: 'EU',
  compliance_status: { score: 87, issues: [] },
  regulation_profile: 'EU-2025',
}

// Simple in-memory cache by companyId
const complianceCache = new Map<string, Compliance>()

export function useCompliance(
  supabase: SupabaseClient,
  options: UseComplianceOptions
): UseComplianceReturn {
  const compliance = shallowRef<Compliance | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    error.value = null

    // Caching
    if (!useMock.value && complianceCache.has(options.companyId)) {
      compliance.value = complianceCache.get(options.companyId)!
      loading.value = false
      return
    }

    if (useMock.value) {
      compliance.value = mockCompliance
      loading.value = false
      return
    }

    let companyData, companyErr
    try {
      ({ data: companyData, error: companyErr } = await supabase
        .from('companies')
        .select('*')
        .eq('id', options.companyId)
        .single())
      if (companyErr) throw companyErr
      compliance.value = companyData
      complianceCache.set(options.companyId, companyData)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
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
    compliance,
    error,
    loading,
    refetch: fetchData,
  }
}
