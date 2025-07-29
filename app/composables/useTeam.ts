// Composable: useTeam
// Fetches team members for a company
// Usage: const { team, error, loading, refetch } = useTeam(supabase, { companyId, useMock })

import { ref, computed, watch, shallowRef, onMounted } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Ref, ShallowRef } from 'vue'

const isClient = typeof window !== 'undefined'

interface TeamMember {
  id: string
  company_id: string
  user_id: string
  email: string
  role: string
  invited_at: string
  joined_at: string
  status: string
  invited_by: string
  permissions: string[]
  created_at: string
  updated_at: string
}

interface UseTeamOptions {
  companyId: string
  useMock?: boolean
}

type UseTeamReturn = {
  team: ShallowRef<TeamMember[]>
  error: Ref<Error | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

// Mock data
const mockTeam: TeamMember[] = [
  {
    id: 'tm1',
    company_id: 'mock-company',
    user_id: 'u1',
    email: 'alice@example.com',
    role: 'admin',
    invited_at: '2025-06-25T09:00:00Z',
    joined_at: '2025-07-01T10:00:00Z',
    status: 'active',
    invited_by: 'admin1',
    permissions: ['manage_team', 'view_reports'],
    created_at: '2025-06-25T09:00:00Z',
    updated_at: '2025-07-01T10:00:00Z',
  },
  {
    id: 'tm2',
    company_id: 'mock-company',
    user_id: 'u2',
    email: 'bob@example.com',
    role: 'member',
    invited_at: '2025-06-28T11:00:00Z',
    joined_at: '2025-07-02T12:00:00Z',
    status: 'pending',
    invited_by: 'admin1',
    permissions: ['view_reports'],
    created_at: '2025-06-28T11:00:00Z',
    updated_at: '2025-07-02T12:00:00Z',
  },
]

// Simple in-memory cache by companyId
const teamCache = new Map<string, TeamMember[]>()

export function useTeam(
  supabase: SupabaseClient,
  options: UseTeamOptions
): UseTeamReturn {
  const team = shallowRef<TeamMember[]>([])
  const error = ref<Error | null>(null)
  const loading = ref(false)

  // Should we use mock data? True if explicitly requested or in development mode
  const useMock = computed(() => options.useMock || process.env.NODE_ENV === 'development')

  async function fetchData() {
    // On server, skip fetching unless using mock data
    if (!isClient && !useMock.value) return
    loading.value = true
    error.value = null

    // Use cache if available and not using mock data
    if (!useMock.value && teamCache.has(options.companyId)) {
      team.value = teamCache.get(options.companyId)!
      loading.value = false
      return
    }

    // Use mock data if requested or in dev mode
    if (useMock.value) {
      team.value = mockTeam
      loading.value = false
      return
    }

    let teamData, teamErr
    try {
      const { data, error: err } = await supabase
        .from('company_users')
        .select('*, users:profiles(email)')
        .eq('company_id', options.companyId)
      if (err) throw err
      teamData = (data || []).map((row: any) => ({
        ...row,
        email: row.users?.email || '',
      }))
      team.value = teamData
      teamCache.set(options.companyId, teamData)
    } catch (err: any) {
      error.value = err
      loading.value = false
      return
    }
    loading.value = false
  }

  watch(() => options.companyId, () => {
    fetchData()
  }, { immediate: true })

  if (isClient) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    team,
    error,
    loading,
    refetch: fetchData,
  }
}
