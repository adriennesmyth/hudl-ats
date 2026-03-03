import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useScorecards() {
  const [scorecards, setScorecards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchScorecards = useCallback(async (candidateId) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('scorecards')
      .select('id, candidate_id, stage_id, scorecard_type, interviewer_name, overall_rating, strengths, concerns, recommendation, created_at, stage:stage_id(name, color)')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })
    if (!error) setScorecards(data ?? [])
    setLoading(false)
  }, [])

  const createScorecard = useCallback(async (scorecardData) => {
    const { data, error } = await supabase
      .from('scorecards')
      .insert({
        candidate_id: scorecardData.candidate_id,
        scorecard_type: scorecardData.scorecard_type ?? 'interview',
        stage_id: scorecardData.stage_id ?? null,
        interviewer_name: scorecardData.interviewer_name,
        overall_rating: scorecardData.overall_rating ?? null,
        strengths: scorecardData.strengths ?? null,
        concerns: scorecardData.concerns ?? null,
        recommendation: scorecardData.recommendation,
      })
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
