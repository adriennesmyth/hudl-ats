import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  MapPin,
  GraduationCap,
  Linkedin,
  FileText,
  UserCheck,
  Clock,
  Star,
  ClipboardList,
  ChevronRight,
  Loader2,
  ExternalLink,
  CheckCircle,
  XCircle,
  MinusCircle,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge, RecommendationBadge } from '../components/ui/Badge'
import { Select } from '../components/ui/Input'
import { useCandidates } from '../hooks/useCandidates'
import { useStages } from '../hooks/useStages'
import { useScorecards } from '../hooks/useScorecards'
import { useStageHistory } from '../hooks/useStageHistory'

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-hudl-orange hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink size={11} />
          </a>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

const HM_DECISION_MAP = {
  strong_yes: { label: 'Hire', color: '#16A34A', icon: CheckCircle, bg: '#f0fdf4', border: '#bbf7d0' },
  yes: { label: 'Hire', color: '#16A34A', icon: CheckCircle, bg: '#f0fdf4', border: '#bbf7d0' },
  neutral: { label: 'Hold', color: '#CA8A04', icon: MinusCircle, bg: '#fefce8', border: '#fef08a' },
  no: { label: 'No Hire', color: '#DC2626', icon: XCircle, bg: '#fef2f2', border: '#fecaca' },
  strong_no: { label: 'No Hire', color: '#DC2626', icon: XCircle, bg: '#fef2f2', border: '#fecaca' },
}

export function CandidateProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchCandidate, updateCandidateStage } = useCandidates()
  const { stages, fetchStages } = useStages()
  const { scorecards, fetchScorecards } = useScorecards()
  const { history, fetchHistory } = useStageHistory()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [movingStage, setMovingStage] = useState(false)
  const [selectedStageId, setSelectedStageId] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [cand] = await Promise.all([
          fetchCandidate(id),
          fetchStages(),
          fetchScorecards(id),
          fetchHistory(id),
        ])
        setCandidate(cand)
        setSelectedStageId(cand?.current_stage_id ?? '')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, fetchCandidate, fetchStages, fetchScorecards, fetchHistory])

  const handleMoveStage = async () => {
    if (!selectedStageId || selectedStageId === candidate?.current_stage_id) return
    const stage = stages.find((s) => s.id === selectedStageId)
    if (!stage) return
    setMovingStage(true)
    try {
      await updateCandidateStage(id, stage.id, stage.name)
      setCandidate((prev) => ({ ...prev, current_stage_id: stage.id, stage }))
    } catch (err) {
      console.error(err)
    } finally {
      setMovingStage(false)
    }
  }

  const initials = candidate
    ? `${candidate.first_name?.[0] ?? ''}${candidate.surname?.[0] ?? ''}`.toUpperCase()
    : ''

  const appliedDate = candidate
    ? new Date(candidate.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const interviewScorecards = scorecards.filter(
    (sc) => !sc.scorecard_type || sc.scorecard_type === 'interview'
  )
  const hmDecisions = scorecards.filter((sc) => sc.scorecard_type === 'hiring_manager')
  const latestHMDecision = hmDecisions[0] ?? null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-hudl-orange" size={28} />
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Candidate not found.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Pipeline
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Profile + Info */}
        <div className="col-span-1 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-hudl-orange-light text-hudl-orange flex items-center justify-center text-xl font-bold mx-auto mb-4">
              {initials}
            </div>
            <h1 className="text-lg font-bold text-hudl-dark">
              {candidate.first_name} {candidate.surname}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{candidate.email}</p>
            {candidate.stage && (
              <div className="mt-3">
                <Badge color={candidate.stage.color}>{candidate.stage.name}</Badge>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">Applied {appliedDate}</p>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Details
            </h2>
            <InfoRow icon={Mail} label="Email" value={candidate.email} href={`mailto:${candidate.email}`} />
            <InfoRow icon={MapPin} label="Address" value={candidate.address} />
            <InfoRow icon={GraduationCap} label="Education" value={candidate.education_level} />
            <InfoRow icon={UserCheck} label="Referred By" value={candidate.referred_by} />
            <InfoRow
              icon={Linkedin}
              label="LinkedIn"
              value={candidate.linkedin_url ? 'View Profile' : null}
              href={candidate.linkedin_url}
            />
            {candidate.cv_url && (
              <InfoRow icon={FileText} label="CV" value="Download CV" href={candidate.cv_url} />
            )}
          </div>

          {/* Move stage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Move Stage
            </h2>
            <Select
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
            >
              <option value="">Select stage…</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Button
              className="w-full mt-3"
              onClick={handleMoveStage}
              disabled={!selectedStageId || selectedStageId === candidate.current_stage_id || movingStage}
            >
              {movingStage ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
              Move Candidate
            </Button>
          </div>
        </div>

        {/* RIGHT: HM Decision + Scorecards + History */}
        <div className="col-span-2 space-y-6">

          {/* Hiring Manager Decision */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-hudl-dark">Hiring Decision</h2>
              <Button
                size="sm"
                variant={latestHMDecision ? 'secondary' : 'primary'}
                onClick={() => navigate(`/candidates/${id}/scorecard?type=hiring_manager`)}
              >
                <UserCheck size={14} />
                {latestHMDecision ? 'Update Decision' : 'Record Decision'}
              </Button>
            </div>

            {latestHMDecision ? (() => {
              const decision = HM_DECISION_MAP[latestHMDecision.recommendation] ?? HM_DECISION_MAP.neutral
              const DecisionIcon = decision.icon
              return (
                <div
                  className="rounded-xl border p-5"
                  style={{ backgroundColor: decision.bg, borderColor: decision.border }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <DecisionIcon size={28} style={{ color: decision.color }} />
                      <div>
                        <p className="text-lg font-bold" style={{ color: decision.color }}>
                          {decision.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          by {latestHMDecision.interviewer_name} ·{' '}
                          {new Date(latestHMDecision.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {latestHMDecision.concerns && (
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed border-t pt-3"
                       style={{ borderColor: decision.border }}>
                      {latestHMDecision.concerns}
                    </p>
                  )}
                </div>
              )
            })() : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <UserCheck size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">No hiring decision yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Record the final hire / hold / no hire decision here.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate(`/candidates/${id}/scorecard?type=hiring_manager`)}
                >
                  Record Decision
                </Button>
              </div>
            )}
          </div>

          {/* Interview Scorecards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-hudl-dark">
                Interview Scorecards
                {interviewScorecards.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({interviewScorecards.length})
                  </span>
                )}
              </h2>
              <Button size="sm" variant="secondary" onClick={() => navigate(`/candidates/${id}/scorecard`)}>
                <ClipboardList size={14} />
                Add Scorecard
              </Button>
            </div>

            {interviewScorecards.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <ClipboardList size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">No interview feedback yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">
                  Add a scorecard after each interview to track feedback across the panel.
                </p>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/candidates/${id}/scorecard`)}>
                  Add First Scorecard
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {interviewScorecards.map((sc) => (
                  <div key={sc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {sc.stage && <Badge color={sc.stage.color}>{sc.stage.name}</Badge>}
                          <RecommendationBadge value={sc.recommendation} />
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{sc.interviewer_name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(sc.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {sc.overall_rating > 0 && <StarRating rating={sc.overall_rating} />}
                    </div>
                    {sc.strengths && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-400 mb-1">Strengths</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                          {sc.strengths}
                        </p>
                      </div>
                    )}
                    {sc.concerns && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-400 mb-1">Concerns</p>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                          {sc.concerns}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stage History */}
          <div>
            <h2 className="text-base font-bold text-hudl-dark mb-3">Stage History</h2>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                <Clock size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No history available.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {history.map((event, i) => (
                  <div key={event.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="relative flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-hudl-orange" />
                      {i < history.length - 1 && (
                        <div className="w-px h-full bg-gray-100 absolute top-2.5 left-1/2 -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{event.stage?.name}</p>
                      {event.moved_by && (
                        <p className="text-xs text-gray-400">by {event.moved_by}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={12} />
                      <span className="text-xs">
                        {new Date(event.moved_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
