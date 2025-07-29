// Composable: useBilling
// Fetches billing info for a company
// Usage: const { billing, error, loading, refetch } = useBilling(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface BillingInfo {
  id: string
  company_id: string
  plan: string
  status: string
  next_invoice_date: string
  amount_due: number
  last_payment_date: string
  last_payment_amount: number
  payment_method: string
  billing_email: string
  created_at: string
  updated_at: string
}

interface UseBillingOptions {
  companyId: string
  useMock?: boolean
}

type UseBillingReturn = {
  billing: ShallowRef<BillingInfo | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockBilling: BillingInfo = {
  id: 'bill1',
  company_id: 'mock-company',
  plan: 'pro',
  status: 'active',
  next_invoice_date: '2025-08-01',
  amount_due: 99,
  last_payment_date: '2025-07-01',
  last_payment_amount: 99,
  payment_method: 'credit_card',
  billing_email: 'billing@mock-company.com',
  created_at: '2025-06-01T10:00:00Z',
  updated_at: '2025-07-01T10:00:00Z',
}

// Simple in-memory cache by companyId
const billingCache = new Map<string, BillingInfo>()

export function useBilling(
  supabase: SupabaseClient,
  options: UseBillingOptions
): UseBillingReturn {
  const billing = shallowRef<BillingInfo | null>(null)
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
    if (!useMock.value && billingCache.has(options.companyId)) {
      billing.value = billingCache.get(options.companyId)!
      loading.value = false
      return
    }

    // Use mock data if requested or in dev mode
    if (useMock.value) {
      billing.value = mockBilling
      loading.value = false
      return
    }

    let billData, billErr
    try {
      const { data, error: err } = await supabase
        .from('company_billing')
        .select('*')
        .eq('company_id', options.companyId)
        .single()
      if (err) throw err
      billData = data
      billing.value = billData || null
      if (billData) billingCache.set(options.companyId, billData)
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
    billing,
    error,
    loading,
    refetch: fetchData,
  }
}
