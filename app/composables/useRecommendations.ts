import { ref } from 'vue'

export function useRecommendations(supabase) {
  const recommendations = ref([])
  const implementedIds = ref([])
  const loading = ref(false)
  const errorMsg = ref('')

  async function fetchRecommendations() {
    loading.value = true
    errorMsg.value = ''
    const { data, error } = await supabase.from('recommendations').select('*')
    if (!error && data) {
      recommendations.value = data
      implementedIds.value = data.filter(r => r.implemented).map(r => r.id)
    } else if (error) {
      errorMsg.value = error.message || 'Failed to fetch recommendations.'
    }
    loading.value = false
  }

  async function markAsImplemented(id: string) {
    loading.value = true
    errorMsg.value = ''
    const { error } = await supabase.from('recommendations').update({ implemented: true }).eq('id', id)
    if (!error) {
      implementedIds.value.push(id)
    } else {
      errorMsg.value = error.message || 'Failed to update recommendation.'
    }
    loading.value = false
  }

  return {
    recommendations,
    implementedIds,
    loading,
    errorMsg,
    fetchRecommendations,
    markAsImplemented
  }
}
