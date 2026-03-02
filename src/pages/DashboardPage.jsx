import { Link } from 'react-router-dom'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import { Users, Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={20} className="text-hudl-orange" />
            <h1 className="text-xl font-bold text-hudl-dark">Pipeline</h1>
          </div>
          <p className="text-sm text-gray-500">
            Drag and drop candidates between stages to update their progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" asChild>
            <a href="/apply" target="_blank" rel="noopener noreferrer">
              <Plus size={14} />
              New Application
            </a>
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <KanbanBoard />
    </div>
  )
}
