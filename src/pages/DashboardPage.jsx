import { useEffect, useMemo } from 'react'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import { Users, Plus, TrendingUp, Calendar, GitBranch } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useStages } from '../hooks/useStages'
import { useCandidates } from '../hooks/useCandidates'

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-hudl-dark leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { stages, fetchStages } = useStages()
  const { candidates, fetchCandidates, updateCandidateStage } = useCandidates()

  useEffect(() => {
    fetchStages()
    fetchCandidates()
  }, [fetchStages, fetchCandidates])

  const stats = useMemo(() => {
    const total = candidates.length
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newThisWeek = candidates.filter(
      (c) => new Date(c.created_at) >= oneWeekAgo
    ).length
    const firstStageId = stages[0]?.id
    const active = candidates.filter(
      (c) => c.current_stage_id && c.current_stage_id !== firstStageId
    ).length
    return { total, newThisWeek, active, stageCount: stages.length }
  }, [candidates, stages])

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
        <Button variant="secondary" size="sm" asChild>
          <a href="/apply" target="_blank" rel="noopener noreferrer">
            <Plus size={14} />
            New Application
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Candidates"
          value={stats.total}
          icon={Users}
          accent="#ff6300"
        />
        <StatCard
          label="New This Week"
          value={stats.newThisWeek}
          icon={Calendar}
          accent="#0046af"
        />
        <StatCard
          label="Active in Pipeline"
          value={stats.active}
          icon={TrendingUp}
          accent="#16a34a"
        />
        <StatCard
          label="Pipeline Stages"
          value={stats.stageCount}
          icon={GitBranch}
          accent="#7c3aed"
        />
      </div>

      {/* Kanban */}
      <KanbanBoard
        stages={stages}
        candidates={candidates}
        updateCandidateStage={updateCandidateStage}
        refetchCandidates={fetchCandidates}
      />
    </div>
  )
}
