import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, Upload, X, Loader2 } from 'lucide-react'
import { Input, Select } from '../components/ui/Input'
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

const PHONE_CODES = [
  { code: '+1',   label: '+1 — US / Canada' },
  { code: '+44',  label: '+44 — UK' },
  { code: '+61',  label: '+61 — Australia' },
  { code: '+64',  label: '+64 — New Zealand' },
  { code: '+353', label: '+353 — Ireland' },
  { code: '+27',  label: '+27 — South Africa' },
  { code: '+49',  label: '+49 — Germany' },
  { code: '+33',  label: '+33 — France' },
  { code: '+34',  label: '+34 — Spain' },
  { code: '+39',  label: '+39 — Italy' },
  { code: '+31',  label: '+31 — Netherlands' },
  { code: '+46',  label: '+46 — Sweden' },
  { code: '+47',  label: '+47 — Norway' },
  { code: '+45',  label: '+45 — Denmark' },
  { code: '+358', label: '+358 — Finland' },
  { code: '+91',  label: '+91 — India' },
  { code: '+86',  label: '+86 — China' },
  { code: '+81',  label: '+81 — Japan' },
  { code: '+82',  label: '+82 — South Korea' },
  { code: '+65',  label: '+65 — Singapore' },
  { code: '+60',  label: '+60 — Malaysia' },
  { code: '+971', label: '+971 — UAE' },
  { code: '+966', label: '+966 — Saudi Arabia' },
  { code: '+55',  label: '+55 — Brazil' },
  { code: '+52',  label: '+52 — Mexico' },
  { code: '+54',  label: '+54 — Argentina' },
  { code: '+7',   label: '+7 — Russia' },
  { code: '+63',  label: '+63 — Philippines' },
]

// Hudl swirl mark — the three orange paths from the logo
function HudlMark({ size = 120, opacity = 0.12 }) {
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        fill="#ff6300"
        d="M14.5 4.6c-1.8-1.5-4-2.6-6.4-3q-.9.45-1.8 1.2h-.1C4.1 2.2 1.8 3.1.7 5c-1.2 2-.7 4.5.8 6v.1c-.1.6-.1 1.2-.1 1.8 0 3.5 1.4 6.6 3.7 9 .1.1.2 0 .2-.1-.5-1.4-.8-2.8-.8-4.4 0-1.8.4-3.4 1-4.9 0 0 0-.1.1-.1 1.4-.2 2.8-1 3.6-2.4.5-1 .6-2 .5-3v-.1c1.4-1 3-1.7 4.7-2.1.2 0 .2-.2.1-.2"
      />
      <path
        fill="#ff6300"
        d="M6.9 16.7c-.5 2.3-.3 4.8.6 7.1.6.4 1.3.7 1.9.9l.1.1c.5 2.1 2.4 3.7 4.7 3.7s4.2-1.6 4.7-3.7c0 0 0-.1.1-.1.5-.2 1.1-.5 1.6-.8 3-1.7 5.1-4.5 5.9-7.6 0-.1-.1-.2-.2-.1-.9 1.1-2.1 2.1-3.4 2.9-1.5.9-3.1 1.4-4.8 1.6H18c-.9-1.1-2.3-1.9-3.8-1.9-1.1 0-2 .3-2.8.9h-.1q-2.4-1.05-4.2-3c0-.1-.1-.1-.2 0"
      />
      <path
        fill="#ff6300"
        d="M21.2 17.2c2.2-.8 4.3-2.2 5.8-4.1 0-.7 0-1.4-.1-2.1v-.1c1.6-1.5 2-4 .8-5.9-1.1-2-3.5-2.8-5.6-2.2H22c-.5-.4-1-.7-1.5-1C17.5.1 14-.3 10.9.5c-.1 0-.1.2 0 .2q2.1.45 4.2 1.5c1.5.9 2.8 2 3.8 3.3v.1c-.5 1.3-.5 2.9.3 4.3.5.9 1.3 1.6 2.2 2 0 0 .1 0 .1.1.2 1.7 0 3.4-.5 5.1.1.1.1.1.2.1"
      />
    </svg>
  )
}

const CORE_VALUES = [
  'Play to Win',
  'Win Together',
  'We Listen',
  'Respectfully Blunt',
  'Thrive on the Front Lines',
]

function LeftPanel() {
  return (
    <div
      className="hidden xl:flex xl:w-64 2xl:w-72 shrink-0 bg-hudl-dark sticky top-0 h-screen overflow-hidden items-center justify-center"
      aria-hidden="true"
    >
      {/* Giant ghosted swirl mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HudlMark size={340} opacity={0.06} />
      </div>
      {/* Orange accent — right edge */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-hudl-orange to-transparent opacity-30" />
      {/* Logo mark — bottom left */}
      <div className="absolute bottom-8 left-8">
        <HudlMark size={32} opacity={0.5} />
      </div>
    </div>
  )
}

function RightPanel() {
  return (
    <div
      className="hidden xl:flex xl:w-64 2xl:w-72 shrink-0 bg-hudl-dark sticky top-0 h-screen overflow-hidden flex-col justify-center px-10"
    >
      {/* Giant ghosted swirl mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HudlMark size={340} opacity={0.06} />
      </div>
      {/* Orange accent — left edge */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-hudl-orange to-transparent opacity-30" />

      {/* Values list */}
      <div className="relative z-10">
        <a
          href="https://www.hudl.com/en_gb/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-hudl-orange uppercase tracking-widest mb-6 hover:text-hudl-orange-hover underline underline-offset-2 decoration-hudl-orange/40 transition-colors"
        >
          Our Values ↗
        </a>
        <ul className="space-y-0">
          {CORE_VALUES.map((value, i) => (
            <li key={value}>
              <p className="text-sm font-medium text-white/80 py-3 leading-snug">{value}</p>
              {i < CORE_VALUES.length - 1 && (
                <div className="h-px bg-white/5" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const HUDL_LOGO = (
  <svg viewBox="0 0 87.2 28.5" height="22" aria-label="Hudl">
    <path fill="#ff6300" d="M14.5 4.6c-1.8-1.5-4-2.6-6.4-3q-.9.45-1.8 1.2h-.1C4.1 2.2 1.8 3.1.7 5c-1.2 2-.7 4.5.8 6v.1c-.1.6-.1 1.2-.1 1.8 0 3.5 1.4 6.6 3.7 9 .1.1.2 0 .2-.1-.5-1.4-.8-2.8-.8-4.4 0-1.8.4-3.4 1-4.9 0 0 0-.1.1-.1 1.4-.2 2.8-1 3.6-2.4.5-1 .6-2 .5-3v-.1c1.4-1 3-1.7 4.7-2.1.2 0 .2-.2.1-.2"/>
    <path fill="#ff6300" d="M6.9 16.7c-.5 2.3-.3 4.8.6 7.1.6.4 1.3.7 1.9.9l.1.1c.5 2.1 2.4 3.7 4.7 3.7s4.2-1.6 4.7-3.7c0 0 0-.1.1-.1.5-.2 1.1-.5 1.6-.8 3-1.7 5.1-4.5 5.9-7.6 0-.1-.1-.2-.2-.1-.9 1.1-2.1 2.1-3.4 2.9-1.5.9-3.1 1.4-4.8 1.6H18c-.9-1.1-2.3-1.9-3.8-1.9-1.1 0-2 .3-2.8.9h-.1q-2.4-1.05-4.2-3c0-.1-.1-.1-.2 0"/>
    <path fill="#ff6300" d="M21.2 17.2c2.2-.8 4.3-2.2 5.8-4.1 0-.7 0-1.4-.1-2.1v-.1c1.6-1.5 2-4 .8-5.9-1.1-2-3.5-2.8-5.6-2.2H22c-.5-.4-1-.7-1.5-1C17.5.1 14-.3 10.9.5c-.1 0-.1.2 0 .2q2.1.45 4.2 1.5c1.5.9 2.8 2 3.8 3.3v.1c-.5 1.3-.5 2.9.3 4.3.5.9 1.3 1.6 2.2 2 0 0 .1 0 .1.1.2 1.7 0 3.4-.5 5.1.1.1.1.1.2.1"/>
    <path fill="white" d="M40.8 24.7v-9.6c0-1-.5-1.6-1.7-1.6-.4 0-.8.1-1.2.2v11h-5.5V2.6H38v7.2c.8-.3 1.7-.5 2.7-.5 3.7 0 5.6 1.9 5.6 5.2v10.2zm14.8.4c-4.7 0-7-1.7-7-5.9V9.5h5.5v9.7c0 1 .5 1.4 1.5 1.4.5 0 .9-.1 1.2-.1v-11h5.5v14.4c-1.5.7-4.2 1.2-6.7 1.2m16.9 0c-5.2 0-8-2.8-8-8 0-4.7 2.4-7.7 7.2-7.7.5 0 1.2.1 1.6.2v-7h5.5V24c-1.3.6-3.6 1.1-6.3 1.1m.8-11.5c-.2-.1-.6-.2-1-.2-1.5 0-2.3 1.4-2.3 3.6 0 2.6.8 3.8 2.4 3.8.4 0 .7 0 .9-.1zm8.3 11.1V2.6h5.5v22.1z"/>
  </svg>
)

export function ApplicationPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { createCandidate } = useCandidates()
  const [cvFile, setCvFile] = useState(null)
  const [cvError, setCvError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const fileInputRef = useRef(null)

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setCvError('CV file must be under 10MB.')
      return
    }
    setCvFile(file)
    setCvError(null)
  }

  const removeFile = () => {
    setCvFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data) => {
    if (!cvFile) {
      setCvError('Please upload your CV.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    setCvError(null)
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
      <div className="min-h-screen flex">
        <SidePanel side="left" />
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
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
        <RightPanel />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <LeftPanel />

      {/* Centre: form */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-hudl-dark px-6 pt-10 pb-8 border-b border-white/10">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">{HUDL_LOGO}</div>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
              Hudl <span className="text-hudl-orange">Careers</span>
            </h1>
            <p className="mt-2 text-gray-400 text-sm">
              Join a world-class team helping coaches and athletes realise their potential.
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-hudl-dark mb-1">Apply now</h2>
            <p className="text-gray-500 text-sm">
              Fields marked <span className="text-hudl-orange">*</span> are required.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Personal Information */}
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
                <div className="mt-4 flex gap-3">
                  <div className="w-44 shrink-0">
                    <Select
                      label="Country Code"
                      required
                      error={errors.phone_country_code?.message}
                      {...register('phone_country_code', { required: 'Required' })}
                    >
                      <option value="">Select…</option>
                      {PHONE_CODES.map(({ code, label }) => (
                        <option key={code} value={code}>{label}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      placeholder="7700 900123"
                      error={errors.phone_number?.message}
                      {...register('phone_number', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[\d\s\-().]+$/,
                          message: 'Please enter a valid phone number',
                        },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50" />

              {/* Address */}
              <div className="px-6 py-4">
                <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
                  Address
                </h2>
                <Input
                  label="Address Line 1"
                  required
                  placeholder="123 Main Street"
                  error={errors.address_line1?.message}
                  {...register('address_line1', { required: 'Address is required' })}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="City"
                    required
                    placeholder="London"
                    error={errors.city?.message}
                    {...register('city', { required: 'City is required' })}
                  />
                  <Input
                    label="Postcode / ZIP"
                    required
                    placeholder="SW1A 1AA"
                    error={errors.postcode?.message}
                    {...register('postcode', { required: 'Postcode is required' })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="State / County / Region"
                    required
                    placeholder="Greater London"
                    error={errors.state_region?.message}
                    {...register('state_region', { required: 'State / region is required' })}
                  />
                  <Input
                    label="Country"
                    required
                    placeholder="United Kingdom"
                    error={errors.country?.message}
                    {...register('country', { required: 'Country is required' })}
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
                    required
                    error={errors.education_level?.message}
                    {...register('education_level', { required: 'Education level is required' })}
                  >
                    <option value="">Select level…</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
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

              {/* Links & Documents */}
              <div className="px-6 py-4">
                <h2 className="text-sm font-semibold text-hudl-orange uppercase tracking-wider mb-4">
                  Links &amp; Documents
                </h2>
                <Input
                  label="LinkedIn Profile URL"
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors.linkedin_url?.message}
                  {...register('linkedin_url', {
                    required: 'LinkedIn URL is required',
                    pattern: {
                      value: /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
                      message: 'Please enter a valid LinkedIn URL',
                    },
                  })}
                />

                {/* CV Upload */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    CV / Résumé <span className="text-hudl-orange">*</span>
                  </label>
                  {cvFile ? (
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-hudl-orange-light">
                      <div className="w-8 h-8 bg-hudl-orange/10 rounded flex items-center justify-center shrink-0">
                        <Upload size={14} className="text-hudl-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{cvFile.name}</p>
                        <p className="text-xs text-gray-500">{(cvFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button type="button" onClick={removeFile} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-8 cursor-pointer transition-colors ${
                      cvError ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-hudl-orange hover:bg-hudl-orange-light/50'
                    }`}>
                      <Upload size={22} className={cvError ? 'text-red-400' : 'text-gray-400'} />
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
                  {cvError && <p className="text-xs text-red-500 mt-1">{cvError}</p>}
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
                    <><Loader2 size={16} className="animate-spin" />Submitting…</>
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

      {/* Right decorative panel */}
      <RightPanel />
    </div>
  )
}
