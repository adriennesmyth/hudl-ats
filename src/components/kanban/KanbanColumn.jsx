import { Droppable } from '@hello-pangea/dnd'
import { KanbanCard } from './KanbanCard'
import { Inbox } from 'lucide-react'

export function KanbanColumn({ stage, candidates }) {
  return (
    <div className="flex flex-col w-[256px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="text-sm font-semibold text-gray-700 truncate">{stage.name}</h3>
        </div>
        <span
          className="shrink-0 ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
        >
          {candidates.length}
        </span>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[120px] rounded-xl p-2 transition-all duration-150 ${
              snapshot.isDraggingOver
                ? 'bg-hudl-orange-light ring-2 ring-hudl-orange/30'
                : 'bg-gray-100'
            }`}
          >
            {candidates.map((candidate, index) => (
              <KanbanCard key={candidate.id} candidate={candidate} index={index} />
            ))}
            {provided.placeholder}
            {candidates.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-24 gap-2 px-3">
                <Inbox size={18} className="text-gray-300" />
                <p className="text-xs text-gray-400 text-center leading-snug">
                  No candidates in<br />
                  <span className="font-medium">{stage.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
