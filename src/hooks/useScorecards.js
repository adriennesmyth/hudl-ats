import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useScorecards() {
  const [scorecards, setScorecards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchScorecards = useCallback(async (candidateId) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('scorecards')
      .select('*, stage:stage_id(name, color)')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })
    if (!error) setScorecards(data ?? [])
    setLoading(false)
  }, [])

  const createScorecard = useCallback(async (scorecardData) => {
    const { data, error } = await supabase
      .from('scorecards')
      .insert(scorecardData)
      .select()
      .single()
    if (error) throw error
    return data
  }, [])

  const updateScorecard = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('scorecards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }, [])

  return { scorecards, loading, fetchScorecards, createScorecard, updateScorecard }
}
