import { useState, useEffect, useCallback } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { KanbanColumn } from './KanbanColumn'
import { Loader2 } from 'lucide-react'

export function KanbanBoard({ stages, candidates, updateCandidateStage, refetchCandidates }) {
  const [candidatesByStage, setCandidatesByStage] = useState({})

  // Group candidates by their current stage
  useEffect(() => {
    const grouped = {}
    stages.forEach((stage) => {
      grouped[stage.id] = candidates.filter((c) => c.current_stage_id === stage.id)
    })
    // Candidates with no stage go in first column
    if (stages.length > 0) {
      const unassigned = candidates.filter((c) => !c.current_stage_id)
      grouped[stages[0].id] = [...(grouped[stages[0].id] ?? []), ...unassigned]
    }
    setCandidatesByStage(grouped)
  }, [stages, candidates])

  const onDragEnd = useCallback(
    async (result) => {
      const { source, destination, draggableId } = result
      if (!destination) return
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return

      const destStage = stages.find((s) => s.id === destination.droppableId)
      if (!destStage) return

      // Optimistic UI update
      setCandidatesByStage((prev) => {
        const next = {}
        Object.keys(prev).forEach((k) => (next[k] = [...prev[k]]))

        const srcList = next[source.droppableId] ?? []
        const [moved] = srcList.splice(source.index, 1)
        const updatedMoved = { ...moved, current_stage_id: destination.droppableId }

        if (source.droppableId === destination.droppableId) {
          srcList.splice(destination.index, 0, updatedMoved)
          next[source.droppableId] = srcList
        } else {
          const destList = next[destination.droppableId] ?? []
          destList.splice(destination.index, 0, updatedMoved)
          next[source.droppableId] = srcList
          next[destination.droppableId] = destList
        }
        return next
      })

      try {
        await updateCandidateStage(draggableId, destStage.id, destStage.name)
      } catch {
        refetchCandidates()
      }
    },
    [stages, updateCandidateStage, refetchCandidates],
  )

  if (stages.length === 0 && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-hudl-orange" size={32} />
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            candidates={candidatesByStage[stage.id] ?? []}
          />
        ))}
        {stages.length === 0 && (
          <div className="flex items-center justify-center w-full h-64 text-gray-400 text-sm">
            No stages configured. Go to Stage Manager to add stages.
          </div>
        )}
      </div>
    </DragDropContext>
  )
}
