import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useStageHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async (candidateId) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('candidate_stages')
      .select('*, stage:stage_id(name, color)')
      .eq('candidate_id', candidateId)
      .order('moved_at', { ascending: true })
    if (!error) setHistory(data ?? [])
    setLoading(false)
  }, [])

  return { history, loading, fetchHistory }
}
