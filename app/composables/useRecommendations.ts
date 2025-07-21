import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || '<your-supabase-url>'
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '<your-supabase-key>'
const supabase = createClient(supabaseUrl, supabaseKey)

export function useRecommendations() {
  const recommendations = ref([])
  const implementedIds = ref([])
  const loading = ref(false)

  async function fetchRecommendations() {
    loading.value = true
    const { data, error } = await supabase.from('recommendations').select('*')
    if (!error && data) {
      recommendations.value = data
      implementedIds.value = data.filter(r => r.implemented).map(r => r.id)
    }
    loading.value = false
  }

  async function markAsImplemented(id: string) {
    loading.value = true
    const { error } = await supabase.from('recommendations').update({ implemented: true }).eq('id', id)
    if (!error) {
      implementedIds.value.push(id)
    }
    loading.value = false
  }

  return {
    recommendations,
    implementedIds,
    loading,
    fetchRecommendations,
    markAsImplemented
  }
}
