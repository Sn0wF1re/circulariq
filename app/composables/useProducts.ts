// Composable: useProducts
// Fetches product list/details for a company
// Usage: const { products, error, loading, refetch } = useProducts(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Product {
  id: string
  company_id: string
  name: string
  sku_code: string
  material: string
  weight_grams: number
  recycled_pct: number
  recyclability_pct: number
  reuse_pct: number
  // ...other fields
}

interface UseProductsOptions {
  companyId: string
  useMock?: boolean
}

type UseProductsReturn = {
  products: ShallowRef<Product[]>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockProducts: Product[] = [
  { id: 'p1', company_id: 'mock-company', name: 'Mock Product 1', sku_code: 'SKU1', material: 'Plastic', weight_grams: 100, recycled_pct: 50, recyclability_pct: 80, reuse_pct: 10 },
  { id: 'p2', company_id: 'mock-company', name: 'Mock Product 2', sku_code: 'SKU2', material: 'Paper', weight_grams: 200, recycled_pct: 70, recyclability_pct: 90, reuse_pct: 20 },
]

// Simple in-memory cache by companyId
const productsCache = new Map<string, Product[]>()

export function useProducts(
  supabase: SupabaseClient,
  options: UseProductsOptions
): UseProductsReturn {
  const products = shallowRef<Product[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    error.value = null

    // Caching
    if (!useMock.value && productsCache.has(options.companyId)) {
      products.value = productsCache.get(options.companyId)!
      loading.value = false
      return
    }

    if (useMock.value) {
      products.value = mockProducts
      loading.value = false
      return
    }

    let productData, productErr
    try {
      ({ data: productData, error: productErr } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', options.companyId))
      if (productErr) throw productErr
      products.value = productData || []
      productsCache.set(options.companyId, products.value)
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
    products,
    error,
    loading,
    refetch: fetchData,
  }
}