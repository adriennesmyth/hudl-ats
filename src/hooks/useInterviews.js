import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useInterviews() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchInterviews = useCallback(async (candidateId) => {
    setLoading(true)
    setError(null)
    const { data, err } = await supabase
      .from('interviews')
      .select('*, stage:stage_id(name, color)')
      .eq('candidate_id', candidateId)
      .order('scheduled_at', { ascending: true })
    if (err) setError(err.message)
    else setInterviews(data ?? [])
    setLoading(false)
  }, [])

  const createInterview = useCallback(async (interviewData) => {
    const { data, error: err } = await supabase
      .from('interviews')
      .insert({
        candidate_id: interviewData.candidate_id,
        stage_id: interviewData.stage_id,
        scheduled_at: interviewData.scheduled_at,
        interviewer_email: interviewData.interviewer_email,
        calendar_event_id: interviewData.calendar_event_id ?? null,
        meeting_link: interviewData.meeting_link ?? null,
      })
      .select()
      .single()
    if (err) throw err
    return data
  }, [])

  const updateInterview = useCallback(async (id, updates) => {
    const { data, error: err } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    return data
  }, [])

  const deleteInterview = useCallback(async (id) => {
    const { error: err } = await supabase.from('interviews').delete().eq('id', id)
    if (err) throw err
  }, [])

  return { interviews, loading, error, fetchInterviews, createInterview, updateInterview, deleteInterview }
}
