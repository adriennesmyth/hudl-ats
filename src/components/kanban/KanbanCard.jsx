import { Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'
import { Mail, Calendar, UserCheck } from 'lucide-react'

export function KanbanCard({ candidate, index }) {
  const navigate = useNavigate()
  const initials = `${candidate.first_name?.[0] ?? ''}${candidate.surname?.[0] ?? ''}`.toUpperCase()
  const date = new Date(candidate.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/candidates/${candidate.id}`)}
          className={`bg-white rounded-lg p-3 shadow-sm border cursor-pointer select-none
            transition-all mb-2 last:mb-0
            ${snapshot.isDragging
              ? 'shadow-xl border-hudl-orange rotate-1 scale-105'
              : 'border-gray-100 hover:border-hudl-orange/50 hover:shadow-md'
            }`}
        >
          <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-hudl-orange-light text-hudl-orange flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {candidate.first_name} {candidate.surname}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail size={10} className="text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar size={10} />
              <span className="text-xs">{date}</span>
            </div>
            {candidate.referred_by && (
              <div className="flex items-center gap-1 text-gray-400">
                <UserCheck size={10} />
                <span className="text-xs truncate max-w-[80px]">{candidate.referred_by}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
