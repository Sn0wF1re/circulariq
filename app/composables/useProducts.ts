import { ref } from 'vue'

export function useProducts(supabase) {
  const products = ref([])
  const loading = ref(false)

  async function fetchProducts() {
    loading.value = true
    const { data, error } = await supabase.from('products').select('*')
    if (!error && data) {
      products.value = data
    }
    loading.value = false
  }

  return {
    products,
    loading,
    fetchProducts
  }
}
