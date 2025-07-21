import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || '<your-supabase-url>'
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '<your-supabase-key>'
const supabase = createClient(supabaseUrl, supabaseKey)

export function useProducts() {
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
