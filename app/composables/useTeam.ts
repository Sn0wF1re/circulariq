import { ref } from 'vue'

// ---- 1. Mock Data ----
const mockTeam = [
  { id: '1', name: 'John Smith', email: 'john.smith@ecotech.com', role: 'Admin', status: 'Active', last_login: '2025-07-22 09:15' },
  { id: '2', name: 'Jane Doe', email: 'jane.doe@ecotech.com', role: 'Manager', status: 'Active', last_login: '2025-07-22 08:45' },
  { id: '3', name: 'Emily Green', email: 'emily.green@ecotech.com', role: 'Viewer', status: 'Pending', last_login: '-' },
  { id: '4', name: 'Michael Brown', email: 'michael.brown@ecotech.com', role: 'Manager', status: 'Active', last_login: '2025-07-21 17:30' },
]

export function useTeam({ useMock = false, companyId = null } = {}) {
  const supabase = useSupabaseClient()
  const team = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTeam() {
    if (useMock) {
      team.value = mockTeam
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: teamError } = await supabase
        .from('team')
        .select('*')
        .eq('company_id', companyId)
      if (teamError) throw teamError
      team.value = data || mockTeam
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch team.'
      team.value = mockTeam
    } finally {
      loading.value = false
    }
  }

  async function updateTeamMember(id: string, patch: any) {
    loading.value = true
    error.value = null
    try {
      if (useMock) {
        team.value = team.value.map(u => u.id === id ? { ...u, ...patch } : u)
        return
      }
      const { error: updateError } = await supabase
        .from('team')
        .update(patch)
        .eq('id', id)
      if (updateError) throw updateError
      await fetchTeam()
    } catch (e: any) {
      error.value = e.message || 'Failed to update team member.'
    } finally {
      loading.value = false
    }
  }

  // Optionally, fetch on composable use
  fetchTeam()

  return {
    team,
    loading,
    error,
    refresh: fetchTeam,
    updateTeamMember,
  }
}
