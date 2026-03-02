import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, Upload, X, Loader2 } from 'lucide-react'
import { Input, Select, Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useCandidates } from '../hooks/useCandidates'

const EDUCATION_LEVELS = [
  'High School / GCSEs',
  'A-Levels / College',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Professional Qualification',
  'Other',
]

export function ApplicationPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { createCandidate } = useCandidates()
  const [cvFile, setCvFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const fileInputRef = useRef(null)

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError('CV file must be under 10MB.')
      return
    }
    setCvFile(file)
    setSubmitError(null)
  }

  const removeFile = () => {
    setCvFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await createCandidate(data, cvFile)
      setSubmitted(true)
      reset()
      setCvFile(null)
    } catch (err) {
      setSubmitError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-hudl-dark mb-2">Application Received!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for applying to Hudl. Our team will be in touch soon.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit another application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-hudl-dark border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-hudl-orange rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Hudl</p>
            <p className="text-gray-400 text-xs">Career Application</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-hudl-dark mb-2">Apply to Hudl</h1>
          <p className="text-gray-500">
            Join a world-class team building technology that helps coaches and athletes win.
            Fields marked <span className="text-hudl-orange">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Personal Info */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  placeholder="Jane"
                  error={errors.first_name?.message}
                  {...register('first_name', { required: 'First name is required' })}
                />
                <Input
                  label="Surname"
                  required
                  placeholder="Smith"
                  error={errors.surname?.message}
                  {...register('surname', { required: 'Surname is required' })}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="jane.smith@example.com"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Address"
                  placeholder="123 Main Street, City, Country"
                  error={errors.address?.message}
                  rows={2}
                  {...register('address')}
                />
              </div>
            </div>

            <div className="border-t border-gray-50" />

            {/* Background */}
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
                Background
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Education Level"
                  error={errors.education_level?.message}
                  {...register('education_level')}
                >
                  <option value="">Select level…</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Referred By"
                  placeholder="e.g. John Doe"
                  hint="Leave blank if not referred"
                  {...register('referred_by')}
                />
              </div>
            </div>

            <div className="border-t border-gray-50" />

            {/* Links & CV */}
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
                Links &amp; Documents
              </h2>
              <Input
                label="LinkedIn Profile URL"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                error={errors.linkedin_url?.message}
                {...register('linkedin_url', {
                  pattern: {
                    value: /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
                    message: 'Please enter a valid LinkedIn URL',
                  },
                })}
              />

              {/* CV Upload */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  CV / Résumé
                </label>
                {cvFile ? (
                  <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-hudl-orange-light">
                    <div className="w-8 h-8 bg-hudl-orange/10 rounded flex items-center justify-center shrink-0">
                      <Upload size={14} className="text-hudl-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{cvFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(cvFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 cursor-pointer hover:border-hudl-orange hover:bg-hudl-orange-light/50 transition-colors">
                    <Upload size={22} className="text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-hudl-orange">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={onFileChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
              {submitError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {submitError}
                </div>
              )}
              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-3">
                By submitting, you agree that Hudl may store and process your data for recruitment purposes.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
