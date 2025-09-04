import { ref } from 'vue'
import { useAuditLog } from './useAuditLog'

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
  const { createNotification } = useNotifications()

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
      await useAuditLog({
        action: 'update_team_member',
        target_id: id,
        target_table: 'team',
        meta: patch
      })
      // Notify user of role change
      if (patch.role) {
        await createNotification({
          user_id: id,
          type: 'role_change',
          message: `Your role has been changed to ${patch.role}.`,
          target_type: 'team',
          target_id: id,
          meta: patch
        })
      }
      await fetchTeam()
    } catch (e: any) {
      error.value = e.message || 'Failed to update team member.'
    } finally {
      loading.value = false
    }
  }

  // Accept a pending invite (set status to Active)
  async function acceptInvite(id: string) {
    await updateTeamMember(id, { status: 'Active' })
    await useAuditLog({
      action: 'accept_invite',
      target_id: id,
      target_table: 'team'
    })
    // Notify admin/owner of acceptance
    // (Assume companyId is available and admins/owners can be fetched if needed)
  }

  // Decline a pending invite (remove from team)
  async function declineInvite(id: string) {
    await removeTeamMember(id)
    await useAuditLog({
      action: 'decline_invite',
      target_id: id,
      target_table: 'team'
    })
    // Notify admin/owner of decline
    // (Assume companyId is available and admins/owners can be fetched if needed)
  }

  // Remove a team member
  async function removeTeamMember(id: string) {
    loading.value = true
    error.value = null
    try {
      if (useMock) {
        team.value = team.value.filter(u => u.id !== id)
        return
      }
      const { error: deleteError } = await supabase
        .from('team')
        .delete()
        .eq('id', id)
      if (deleteError) throw deleteError
      await useAuditLog({
        action: 'remove_team_member',
        target_id: id,
        target_table: 'team'
      })
      // Notify user of removal
      await createNotification({
        user_id: id,
        type: 'removed',
        message: 'You have been removed from the team.',
        target_type: 'team',
        target_id: id
      })
      await fetchTeam()
    } catch (e: any) {
      error.value = e.message || 'Failed to remove team member.'
    } finally {
      loading.value = false
    }
  }

  fetchTeam()

  return {
    team,
    loading,
    error,
    refresh: fetchTeam,
    updateTeamMember,
    acceptInvite,
    declineInvite,
    removeTeamMember,
  }
}
