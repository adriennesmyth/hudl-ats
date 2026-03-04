import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useEmailTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('email_templates')
      .select('*, stage:stage_id(id, name, color, order_index)')
      .order('created_at', { ascending: true })
    if (err) setError(err.message)
    else setTemplates(data ?? [])
    setLoading(false)
  }, [])

  const upsertTemplate = useCallback(async (stageId, { subject, body, enabled }) => {
    const { error: err } = await supabase.from('email_templates').upsert(
      { stage_id: stageId, subject, body, enabled, updated_at: new Date().toISOString() },
      { onConflict: 'stage_id' },
    )
    if (err) throw err
  }, [])

  const deleteTemplate = useCallback(async (id) => {
    const { error: err } = await supabase.from('email_templates').delete().eq('id', id)
    if (err) throw err
  }, [])

  return { templates, loading, error, fetchTemplates, upsertTemplate, deleteTemplate }
}
