import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useStages() {
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStages = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('stages')
      .select('*')
      .order('order_index', { ascending: true })
    if (err) setError(err.message)
    else setStages(data ?? [])
    setLoading(false)
  }, [])

  const createStage = useCallback(async (stageData) => {
    const { data: last } = await supabase
      .from('stages')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = last ? last.order_index + 1 : 0

    const { data, error: err } = await supabase
      .from('stages')
      .insert({ ...stageData, order_index: nextOrder })
      .select()
      .single()
    if (err) throw err
    return data
  }, [])

  const updateStage = useCallback(async (id, updates) => {
    const { error: err } = await supabase.from('stages').update(updates).eq('id', id)
    if (err) throw err
  }, [])

  const deleteStage = useCallback(async (id) => {
    const { error: err } = await supabase.from('stages').delete().eq('id', id)
    if (err) throw err
  }, [])

  const reorderStages = useCallback(async (reordered) => {
    const updates = reordered.map((stage, index) =>
      supabase.from('stages').update({ order_index: index }).eq('id', stage.id),
    )
    await Promise.all(updates)
    setStages(reordered)
  }, [])

  return { stages, loading, error, fetchStages, createStage, updateStage, deleteStage, reorderStages }
}
