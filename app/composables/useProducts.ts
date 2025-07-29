import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockProducts = [
  {
    id: '1',
    name: 'Eco Bottle',
    sku_code: 'ECO-001',
    material: 'Recycled PET',
    weight_grams: 50,
    recycled_pct: 80,
    recyclability_pct: 95,
    reuse_pct: 10,
    company_id: 'company-1',
  },
  {
    id: '2',
    name: 'Green Box',
    sku_code: 'GRN-002',
    material: 'Cardboard',
    weight_grams: 120,
    recycled_pct: 60,
    recyclability_pct: 98,
    reuse_pct: 20,
    company_id: 'company-1',
  }
]

export function useProducts({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const products = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    if (useMock) {
      products.value = mockProducts
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: productsError } = await supabase
        .from('products')
        .select('*')
      if (productsError) throw productsError
      products.value = data || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch products'
      products.value = mockProducts
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts
  }
}
