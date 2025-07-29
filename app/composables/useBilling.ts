import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

// ---- 1. Mock Data (from billing page) ----
const mockBillingPlans = [
  {
    id: 1,
    name: 'Starter',
    monthly_price: 49,
    sku_limit: 100,
    user_limit: 5,
    report_limit: 10,
    features: ['Basic analytics', 'Email support', 'Up to 5 users'],
  },
  {
    id: 2,
    name: 'Growth',
    monthly_price: 149,
    sku_limit: 1000,
    user_limit: 25,
    report_limit: 50,
    features: ['Advanced analytics', 'Priority support', 'Up to 25 users', 'Custom branding'],
  },
  {
    id: 3,
    name: 'Enterprise',
    monthly_price: 499,
    sku_limit: 10000,
    user_limit: 100,
    report_limit: 200,
    features: ['All features', 'Dedicated manager', 'Unlimited users', 'API access'],
  },
]

const mockCompanyBilling = {
  plan_id: 2,
  billing_status: 'Active',
  current_period_start: '2025-07-01',
  current_period_end: '2025-07-31',
  usage: {
    skus_used: 800,
    users_used: 20,
    reports_generated: 30,
  },
}

export function useBilling({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const billingPlans = ref<any[]>([])
  const companyBilling = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper: get company_id for current user (customize as needed)
  async function getCompanyId() {
    if (!user.value) return null
    const { data, error } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.value.id)
      .single()
    return data?.company_id || null
  }

  async function fetchBillingData() {
    if (useMock) {
      billingPlans.value = mockBillingPlans
      companyBilling.value = mockCompanyBilling
      return
    }
    loading.value = true
    error.value = null
    try {
      // 1. Fetch billing plans
      const { data: plans, error: plansError } = await supabase
        .from('billing_plans')
        .select('*')
      if (plansError) throw plansError
      billingPlans.value = plans || []

      // 2. Fetch company billing for current user
      const companyId = await getCompanyId()
      if (!companyId) throw new Error('No company found for user')
      const { data: billing, error: billingError } = await supabase
        .from('company_billing')
        .select('*')
        .eq('company_id', companyId)
        .single()
      if (billingError) throw billingError
      companyBilling.value = billing
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch billing data'
      // Fallback to mock data if desired
      billingPlans.value = mockBillingPlans
      companyBilling.value = mockCompanyBilling
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchBillingData)

  // Computed: always fallback to mock if live data is empty
  const billingPlansToShow = computed(() =>
    billingPlans.value.length ? billingPlans.value : mockBillingPlans
  )
  const companyBillingToShow = computed(() =>
    companyBilling.value ? companyBilling.value : mockCompanyBilling
  )

  return {
    billingPlans: billingPlansToShow,
    companyBilling: companyBillingToShow,
    loading,
    error,
    refresh: fetchBillingData
  }
}
