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
    compliance_score: {
      overall_score: 88,
      regulations_met: 10,
      total_regulations: 12
    }
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
    compliance_score: {
      overall_score: 72,
      regulations_met: 8,
      total_regulations: 12
    }
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
      // Fetch products
      const { data: productData, error: productsError } = await supabase
        .from('products')
        .select('*')
      if (productsError) throw productsError
      const productIds = (productData || []).map(p => p.id)
      // Fetch compliance scores for all products
      const { data: scoresData, error: scoresError } = await supabase
        .from('compliance_scores')
        .select('product_id, overall_score, regulations_met, total_regulations')
        .in('product_id', productIds)
      if (scoresError) throw scoresError
      // Map scores to products
      const scoresMap = new Map()
      for (const score of scoresData || []) {
        scoresMap.set(score.product_id, score)
      }
      products.value = (productData || []).map(p => ({
        ...p,
        compliance_score: scoresMap.get(p.id) || { overall_score: 0, regulations_met: 0, total_regulations: 0 }
      }))
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
