import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockProducts = [
  {
    id: '1',
    name: 'Eco Bottle',
    sku_code: 'ECO-001',
    material: 'Recycled PET',
    weight_grams: 50,
    recycled_weight: 40,
    recycled_pct: 80,
    recyclability_pct: 95,
    reuse_pct: 10,
    company_id: 'company-1',
    circular_score: 88
  },
  {
    id: '2',
    name: 'Green Box',
    sku_code: 'GRN-002',
    material: 'Cardboard',
    weight_grams: 120,
    recycled_weight: 80,
    recycled_pct: 60,
    recyclability_pct: 98,
    reuse_pct: 20,
    company_id: 'company-1',
    circular_score: 72
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
      // Fetch products including circular_score
      const { data: productData, error: productsError } = await supabase
        .from('products')
        .select('*')
      if (productsError) throw productsError
      products.value = productData || []
      console.log('products: ', products.value)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch products'
      products.value = mockProducts
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: any) {
    if (useMock) {
      // Add to mock data
      const newId = (mockProducts.length + 1).toString()
      const newProduct = { ...product, id: newId }
      mockProducts.push(newProduct)
      products.value = [...mockProducts]
      return { error: null }
    }
    loading.value = true
    error.value = null
    try {
      // Only send fields that exist in the products table schema
      const validProduct = {
        name: product.name,
        sku_code: product.sku_code,
        material: product.material,
        weight_grams: product.weight_grams,
        recycled_weight: product.recycled_weight,
        recyclability_pct: product.recyclability_pct,
        reuse_pct: product.reuse_pct,
        company_id: product.company_id
      }
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert([validProduct])
        .select()
        .maybeSingle()
      if (insertError) throw insertError
      // Add to products list
      products.value = [
        ...(products.value || []),
        inserted
      ]
      return { error: null }
    } catch (e: any) {
      error.value = e.message || 'Failed to add product'
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(product: any) {
    if (useMock) {
      const idx = mockProducts.findIndex((p) => p.id === product.id)
      if (idx !== -1) {
        mockProducts[idx] = { ...mockProducts[idx], ...product }
        products.value = [...mockProducts]
      }
      return { error: null }
    }
    loading.value = true
    error.value = null
    try {
      const validProduct = {
        name: product.name,
        sku_code: product.sku_code,
        material: product.material,
        weight_grams: product.weight_grams,
        recycled_weight: product.recycled_weight,
        recyclability_pct: product.recyclability_pct,
        reuse_pct: product.reuse_pct
      }
      const { error: updateError } = await supabase
        .from('products')
        .update(validProduct)
        .eq('id', product.id)
      if (updateError) throw updateError
      // Update local list
      await fetchProducts()
      return { error: null }
    } catch (e: any) {
      error.value = e.message || 'Failed to update product'
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(productId: string) {
    if (useMock) {
      const idx = mockProducts.findIndex((p) => p.id === productId)
      if (idx !== -1) {
        mockProducts.splice(idx, 1)
        products.value = [...mockProducts]
      }
      return { error: null }
    }
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
      if (deleteError) throw deleteError
      // Update local list
      await fetchProducts()
      return { error: null }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete product'
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
