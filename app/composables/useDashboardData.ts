// Composable: useDashboardData
// Fetches company info, metrics, and reports for the dashboard, scoped by company_id
// Usage: const { company, metrics, reports, error, loading, refetch } = useDashboardData(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
// For SSR-awareness
const isClient = typeof window !== 'undefined'

// Types
interface Company {
  id: string
  name: string
  sector: string
  region: string
  compliance_status: any
  regulation_profile: string
  // ...other fields
}

interface Product {
  id: string
  name: string
  // ...other fields
}

interface Report {
  id: string
  company_id: string
  product_id: string
  reporting_period: string
  total_plastic_kg: number
  emissions_co2e: number
  footprint_score: number
  // ...other fields
}

interface DashboardMetrics {
  totalProducts: number
  totalReports: number
  avgFootprintScore: number
}

interface UseDashboardDataOptions {
  companyId: string
  useMock?: boolean
}

// Mock data
const mockCompany: Company = {
  id: 'mock-company',
  name: 'Mock Company',
  sector: 'Packaging',
  region: 'EU',
  compliance_status: {},
  regulation_profile: 'EU-2025',
}
const mockProducts: Product[] = [
  { id: 'p1', name: 'Mock Product 1' },
  { id: 'p2', name: 'Mock Product 2' },
]
const mockReports: Report[] = [
  { id: 'r1', company_id: 'mock-company', product_id: 'p1', reporting_period: '2025-07', total_plastic_kg: 100, emissions_co2e: 50, footprint_score: 80 },
  { id: 'r2', company_id: 'mock-company', product_id: 'p2', reporting_period: '2025-07', total_plastic_kg: 200, emissions_co2e: 120, footprint_score: 75 },
]

function calculateMetrics(products: Product[], reports: Report[]): DashboardMetrics {
  const totalProducts = products.length
  const totalReports = reports.length
  const avgFootprintScore = reports.length
    ? reports.reduce((sum, r) => sum + (r.footprint_score || 0), 0) / reports.length
    : 0
  return { totalProducts, totalReports, avgFootprintScore }
}

import type { Ref, ShallowRef } from 'vue'

type UseDashboardDataReturn = {
  company: ShallowRef<Company | null>
  products: ShallowRef<Product[]>
  reports: ShallowRef<Report[]>
  metrics: ShallowRef<DashboardMetrics>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
  productLoading: Ref<boolean>
  reportLoading: Ref<boolean>
  errors: Ref<{ company?: Error; products?: Error; reports?: Error }>
}

// Simple in-memory cache by companyId
const dashboardCache = new Map<string, { company: Company, products: Product[], reports: Report[], metrics: DashboardMetrics }>()

export function useDashboardData(
  supabase: SupabaseClient,
  options: UseDashboardDataOptions
): UseDashboardDataReturn {
  const company = shallowRef<Company | null>(null)
  const products = shallowRef<Product[]>([])
  const reports = shallowRef<Report[]>([])
  const metrics = shallowRef<DashboardMetrics>({ totalProducts: 0, totalReports: 0, avgFootprintScore: 0 })
  const error = ref<Error | null>(null)
  const errors = ref<{ company?: Error; products?: Error; reports?: Error }>({})
  const loading = ref(false)
  const productLoading = ref(false)
  const reportLoading = ref(false)

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    error.value = null
    errors.value = {}

    // Caching
    if (!useMock.value && dashboardCache.has(options.companyId)) {
      const cached = dashboardCache.get(options.companyId)!
      company.value = cached.company
      products.value = cached.products
      reports.value = cached.reports
      metrics.value = cached.metrics
      loading.value = false
      return
    }

    if (useMock.value) {
      company.value = mockCompany
      products.value = mockProducts
      reports.value = mockReports
      metrics.value = calculateMetrics(mockProducts, mockReports)
      loading.value = false
      return
    }

    // Fetch company
    let companyData, companyErr
    try {
      ({ data: companyData, error: companyErr } = await supabase
        .from('companies')
        .select('*')
        .eq('id', options.companyId)
        .single())
      if (companyErr) throw companyErr
      company.value = companyData
    } catch (err: any) {
      errors.value.company = err
      error.value = err
      loading.value = false
      return
    }

    // Fetch products
    productLoading.value = true
    let productData, productErr
    try {
      ({ data: productData, error: productErr } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', options.companyId))
      if (productErr) throw productErr
      products.value = productData || []
    } catch (err: any) {
      errors.value.products = err
      error.value = err
      productLoading.value = false
      loading.value = false
      return
    }
    productLoading.value = false

    // Fetch reports (add pagination/filtering support if needed)
    reportLoading.value = true
    let reportData, reportErr
    try {
      ({ data: reportData, error: reportErr } = await supabase
        .from('footprint_reports')
        .select('*')
        .eq('company_id', options.companyId))
      if (reportErr) throw reportErr
      reports.value = reportData || []
    } catch (err: any) {
      errors.value.reports = err
      error.value = err
      reportLoading.value = false
      loading.value = false
      return
    }
    reportLoading.value = false

    metrics.value = calculateMetrics(products.value, reports.value)
    // Cache result
    dashboardCache.set(options.companyId, {
      company: company.value!,
      products: products.value,
      reports: reports.value,
      metrics: metrics.value,
    })
    loading.value = false
  }

  // Refetch when companyId changes
  watch(() => options.companyId, () => {
    fetchData()
  }, { immediate: true })

  // SSR hydration: fetch on mount if client
  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    company,
    products,
    reports,
    metrics,
    error,
    loading,
    refetch: fetchData,
    productLoading,
    reportLoading,
    errors,
  }
}
