import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface Recommendation {
  id: string
  product_id: string
  title: string
  details: string
  ai_confidence: number
  estimated_cost: number
  difficulty: string
  implemented?: boolean
  // ...other fields
}

interface UseRecommendationsOptions {
  companyId: string
  useMock?: boolean
}

type UseRecommendationsReturn = {
  recommendations: ShallowRef<Recommendation[]>
  implementedIds: ShallowRef<string[]>
  loading: Ref<boolean>
  errorMsg: Ref<string>
  fetchRecommendations: () => Promise<void>
  markAsImplemented: (id: string) => Promise<void>
}

// Mock data
const mockRecommendations: Recommendation[] = [
  { id: 'rec1', product_id: 'p1', title: 'Switch to recycled plastic', details: 'Use 80% recycled content', ai_confidence: 0.92, estimated_cost: 1000, difficulty: 'Medium', implemented: false },
  { id: 'rec2', product_id: 'p2', title: 'Reduce packaging weight', details: 'Lightweight design', ai_confidence: 0.85, estimated_cost: 500, difficulty: 'Easy', implemented: true },
]

// Simple in-memory cache by companyId
const recommendationsCache = new Map<string, Recommendation[]>()

export function useRecommendations(
  supabase: SupabaseClient,
  options: UseRecommendationsOptions
): UseRecommendationsReturn {
  const recommendations = shallowRef<Recommendation[]>([])
  const implementedIds = shallowRef<string[]>([])
  const loading = ref(false)
  const errorMsg = ref('')

  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchRecommendations() {
    if (!isClient && !useMock.value) return // SSR: skip on server unless using mock
    loading.value = true
    errorMsg.value = ''

    // Caching
    if (!useMock.value && recommendationsCache.has(options.companyId)) {
      recommendations.value = recommendationsCache.get(options.companyId)!
      implementedIds.value = recommendations.value.filter(r => r.implemented).map(r => r.id)
      loading.value = false
      return
    }

    if (useMock.value) {
      recommendations.value = mockRecommendations
      implementedIds.value = mockRecommendations.filter(r => r.implemented).map(r => r.id)
      loading.value = false
      return
    }

    let recData, recErr
    try {
      // Join with products to filter by company
      const { data, error } = await supabase
        .from('recommendations')
        .select('*, products!inner(company_id)')
        .eq('products.company_id', options.companyId)
      if (error) throw error
      recData = data
      recommendations.value = recData || []
      implementedIds.value = (recData || []).filter((r: any) => r.implemented).map((r: any) => r.id)
      recommendationsCache.set(options.companyId, recommendations.value)
    } catch (err: any) {
      errorMsg.value = err.message || 'Failed to fetch recommendations.'
      loading.value = false
      return
    }
    loading.value = false
  }

  async function markAsImplemented(id: string) {
    loading.value = true
    errorMsg.value = ''
    try {
      const { error } = await supabase.from('recommendations').update({ implemented: true }).eq('id', id)
      if (error) throw error
      if (!implementedIds.value.includes(id)) implementedIds.value.push(id)
      // Optionally update the recommendation in the list
      const rec = recommendations.value.find(r => r.id === id)
      if (rec) rec.implemented = true
    } catch (err: any) {
      errorMsg.value = err.message || 'Failed to update recommendation.'
    }
    loading.value = false
  }

  watch(() => options.companyId, () => {
    fetchRecommendations()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchRecommendations()
    })
  }

  return {
    recommendations,
    implementedIds,
    loading,
    errorMsg,
    fetchRecommendations,
    markAsImplemented,
  }
}
