import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockRecommendations = [
  {
    id: '1',
    title: 'Switch to Renewable Energy',
    details: 'Transition your operations to renewable energy sources to reduce carbon footprint.',
    product_id: 'prod1',
    difficulty: 'Medium',
    ai_confidence: 0.85,
    estimated_cost: 12000,
    implemented: false
  },
  {
    id: '2',
    title: 'Optimize Logistics',
    details: 'Improve logistics efficiency to minimize emissions and costs.',
    product_id: 'prod2',
    difficulty: 'Easy',
    ai_confidence: 0.78,
    estimated_cost: 5000,
    implemented: false
  },
  {
    id: '3',
    title: 'Eco-friendly Packaging',
    details: 'Adopt biodegradable or recyclable packaging materials.',
    product_id: 'prod3',
    difficulty: 'Hard',
    ai_confidence: 0.65,
    estimated_cost: 20000,
    implemented: false
  }
]

export function useRecommendations({ useMock = false } = {}) {
  const supabase = useSupabaseClient()
  const recommendations = ref<any[]>([])
  const implementedIds = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRecommendations() {
    if (useMock) {
      recommendations.value = mockRecommendations
      implementedIds.value = mockRecommendations.filter(r => r.implemented).map(r => r.id)
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: recError } = await supabase.from('recommendations').select('*')
      if (recError) throw recError
      recommendations.value = data || []
      implementedIds.value = (data || []).filter(r => r.implemented).map(r => r.id)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch recommendations.'
      recommendations.value = mockRecommendations
      implementedIds.value = mockRecommendations.filter(r => r.implemented).map(r => r.id)
    } finally {
      loading.value = false
    }
  }

  async function markAsImplemented(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: updateError } = await supabase.from('recommendations').update({ implemented: true }).eq('id', id)
      if (updateError) throw updateError
      if (!implementedIds.value.includes(id)) implementedIds.value.push(id)
      // Optionally update the local recommendation object
      const rec = recommendations.value.find(r => r.id === id)
      if (rec) rec.implemented = true
    } catch (e: any) {
      error.value = e.message || 'Failed to update recommendation.'
    } finally {
      loading.value = false
    }
  }

  return {
    recommendations,
    implementedIds,
    loading,
    error,
    fetchRecommendations,
    markAsImplemented
  }
}
