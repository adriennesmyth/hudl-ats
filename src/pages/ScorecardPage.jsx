import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, Star, ClipboardList, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useCandidates } from '../hooks/useCandidates'
import { useStages } from '../hooks/useStages'
import { useScorecards } from '../hooks/useScorecards'

const RECOMMENDATIONS = [
  { value: 'strong_yes', label: 'Strong Yes', color: '#16A34A' },
  { value: 'yes', label: 'Yes', color: '#65A30D' },
  { value: 'neutral', label: 'Neutral', color: '#CA8A04' },
  { value: 'no', label: 'No', color: '#EA580C' },
  { value: 'strong_no', label: 'Strong No', color: '#DC2626' },
]

function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={28}
            className={`transition-colors ${
              n <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  )
}

export function ScorecardPage() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const { fetchCandidate } = useCandidates()
  const { stages, fetchStages } = useStages()
  const { createScorecard } = useScorecards()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { overall_rating: 0 } })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [cand] = await Promise.all([fetchCandidate(candidateId), fetchStages()])
        setCandidate(cand)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [candidateId, fetchCandidate, fetchStages])

  const onSubmit = async (data) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createScorecard({
        candidate_id: candidateId,
        stage_id: data.stage_id,
        interviewer_name: data.interviewer_name,
        overall_rating: Number(data.overall_rating),
        strengths: data.strengths || null,
        concerns: data.concerns || null,
        recommendation: data.recommendation,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message ?? 'Failed to save scorecard.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-hudl-orange" size={28} />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-hudl-dark mb-2">Scorecard Saved</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your feedback for {candidate?.first_name} {candidate?.surname} has been recorded.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(`/candidates/${candidateId}`)}>
            View Candidate Profile
          </Button>
          <Button variant="secondary" onClick={() => setSubmitted(false)}>
            Add Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <button
        onClick={() => navigate(`/candidates/${candidateId}`)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={20} className="text-hudl-orange" />
        <div>
          <h1 className="text-xl font-bold text-hudl-dark">Interview Scorecard</h1>
          {candidate && (
            <p className="text-sm text-gray-500">
              Feedback for{' '}
              <span className="font-medium text-gray-700">
                {candidate.first_name} {candidate.surname}
              </span>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Interviewer + Stage */}
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
              Interview Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Interviewer Name"
                required
                placeholder="Your full name"
                error={errors.interviewer_name?.message}
                {...register('interviewer_name', { required: 'Interviewer name is required' })}
              />
              <Select
                label="Interview Stage"
                required
                error={errors.stage_id?.message}
                {...register('stage_id', { required: 'Please select a stage' })}
              >
                <option value="">Select stage…</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="border-t border-gray-50" />

          {/* Rating */}
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
              Evaluation
            </h2>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Overall Rating <span className="text-hudl-orange">*</span>
              </label>
              <Controller
                name="overall_rating"
                control={control}
                rules={{ min: { value: 1, message: 'Please provide a rating' } }}
                render={({ field }) => (
                  <StarRatingInput value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.overall_rating && (
                <p className="text-xs text-red-500 mt-1">{errors.overall_rating.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Recommendation <span className="text-hudl-orange">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {RECOMMENDATIONS.map(({ value, label, color }) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      className="sr-only peer"
                      {...register('recommendation', {
                        required: 'Please select a recommendation',
                      })}
                    />
                    <span
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all peer-checked:scale-105"
                      style={{
                        borderColor: color,
                        color: color,
                        backgroundColor: 'transparent',
                      }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.recommendation && (
                <p className="text-xs text-red-500 mt-2">{errors.recommendation.message}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-50" />

          {/* Strengths & Concerns */}
          <div className="px-6 py-4 space-y-4">
            <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider">
              Feedback &amp; Notes
            </h2>
            <Textarea
              label="Strengths"
              placeholder="What stood out positively? Key skills, experience, culture fit…"
              rows={3}
              {...register('strengths')}
            />
            <Textarea
              label="Concerns"
              placeholder="Any reservations, gaps, or areas to probe further…"
              rows={3}
              {...register('concerns')}
            />
          </div>

          {/* Submit */}
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
            {submitError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {submitError}
              </div>
            )}
            <div className="flex gap-3">
              <Button type="submit" size="lg" disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Scorecard'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate(`/candidates/${candidateId}`)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
