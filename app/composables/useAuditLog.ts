/**
 * Log an activity to the activity_logs table.
 * @param {Object} params
 * @param {string} params.action - The action performed (e.g. 'add_team_member', 'update_company', 'delete_product').
 * @param {string} [params.target_id] - The ID of the target row/entity.
 * @param {string} [params.target_table] - The table affected (e.g. 'products', 'companies').
 * @param {Object} [params.meta] - Any extra metadata (will be stored as JSONB).
 * @returns {Promise<void>}
 */
export async function useAuditLog({ action, target_id, target_table, meta }: {
  action: string,
  target_id?: string,
  target_table?: string,
  meta?: any
}) {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  if (!user.value) return
  await supabase.from('activity_logs').insert({
    user_id: user.value.id,
    action,
    target_id,
    target_table,
    meta
  })
}
