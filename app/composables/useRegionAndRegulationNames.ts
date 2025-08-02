import { ref, onMounted } from 'vue'

export function useRegionAndRegulationNames() {
  const regions = ref<{ id: string; name: string }[]>([])
  const regulationProfiles = ref<{ id: string; name: string }[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLookups() {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data: regionData } = await supabase.from('regions').select('id, name')
      const { data: regProfileData } = await supabase.from('regulation_profiles').select('id, name')
      regions.value = regionData || []
      regulationProfiles.value = regProfileData || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch lookups'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchLookups)

  function getRegionName(id: string) {
    return regions.value.find(r => r.id === id)?.name || id
  }
  function getRegulationProfileName(id: string) {
    return regulationProfiles.value.find(r => r.id === id)?.name || id
  }

  return {
    regions,
    regulationProfiles,
    getRegionName,
    getRegulationProfileName,
    loading,
    error,
    refresh: fetchLookups
  }
}
