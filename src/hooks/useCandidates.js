import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCandidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('candidates')
        .select('*, stage:current_stage_id(id, name, color)')
        .order('created_at', { ascending: false })
      if (err) throw err
      setCandidates(data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCandidate = useCallback(async (id) => {
    const { data, error: err } = await supabase
      .from('candidates')
      .select('*, stage:current_stage_id(id, name, color)')
      .eq('id', id)
      .single()
    if (err) throw err
    return data
  }, [])

  const createCandidate = useCallback(async (formData, cvFile) => {
    let cvUrl = null

    if (cvFile) {
      const fileName = `${Date.now()}-${cvFile.name.replace(/\s+/g, '_')}`
      const { error: uploadErr } = await supabase.storage
        .from('cvs')
        .upload(fileName, cvFile, { cacheControl: '3600', upsert: false })
      if (uploadErr) throw uploadErr
      const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName)
      cvUrl = urlData.publicUrl
    }

    // Assign to first stage (Applied)
    const { data: firstStage } = await supabase
      .from('stages')
      .select('id, name')
      .order('order_index', { ascending: true })
      .limit(1)
      .single()

    const { data, error: insertErr } = await supabase
      .from('candidates')
      .insert({
        first_name: formData.first_name,
        surname: formData.surname,
        email: formData.email,
        phone_country_code: formData.phone_country_code || null,
        phone_number: formData.phone_number || null,
        address_line1: formData.address_line1 || null,
        city: formData.city || null,
        state_region: formData.state_region || null,
        postcode: formData.postcode || null,
        country: formData.country || null,
        referred_by: formData.referred_by || null,
        education_level: formData.education_level || null,
        linkedin_url: formData.linkedin_url || null,
        cv_url: cvUrl,
        current_stage_id: firstStage?.id ?? null,
      })
      .select()
      .single()

    if (insertErr) throw insertErr

    // Log initial stage in pipeline history
    if (firstStage) {
      await supabase.from('candidate_stages').insert({
        candidate_id: data.id,
        stage_id: firstStage.id,
      })
    }

    // Fire-and-forget: send confirmation + recruiter notification emails
    fetch('/api/send-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Email failure should never block the application submission
    })

    return data
  }, [])

  const uploadCv = useCallback(async (candidateId, cvFile) => {
    const fileName = `${Date.now()}-${cvFile.name.replace(/\s+/g, '_')}`
    const { error: uploadErr } = await supabase.storage
      .from('cvs')
      .upload(fileName, cvFile, { cacheControl: '3600', upsert: false })
    if (uploadErr) throw uploadErr
    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName)
    const cvUrl = urlData.publicUrl
    const { error: updateErr } = await supabase
      .from('candidates')
      .update({ cv_url: cvUrl })
      .eq('id', candidateId)
    if (updateErr) throw updateErr
    return cvUrl
  }, [])

  const updateCandidateStage = useCallback(async (candidateId, stageId, movedBy = null) => {
    const { error: updateErr } = await supabase
      .from('candidates')
      .update({ current_stage_id: stageId, updated_at: new Date().toISOString() })
      .eq('id', candidateId)
    if (updateErr) throw updateErr

    await supabase.from('candidate_stages').insert({
      candidate_id: candidateId,
      stage_id: stageId,
      moved_by: movedBy,
    })

    fetch('/api/send-stage-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, stageId }),
    }).catch(() => {})
  }, [])

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    fetchCandidate,
    createCandidate,
    uploadCv,
    updateCandidateStage,
  }
}
