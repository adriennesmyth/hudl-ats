import { useState, useEffect } from 'react'
import { Mail, Pencil, X, Check, Loader2, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useStages } from '../hooks/useStages'
import { useEmailTemplates } from '../hooks/useEmailTemplates'

const VARIABLES = ['{{first_name}}', '{{surname}}', '{{stage_name}}']

// Best-practice templates keyed by keyword patterns (checked against lowercase stage name)
const DEFAULTS = [
  {
    keywords: ['applied', 'application', 'received'],
    subject: 'We\'ve received your application — Hudl India',
    body: `Hi {{first_name}},

Thank you for applying to Hudl India! We're excited to learn more about you.

Our recruiting team will review your application and be in touch within 5 business days. In the meantime, feel free to learn more about life at Hudl at hudl.com/about.

Thanks again for your interest — we'll be in touch soon.

Warm regards,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['phone', 'screen', 'screening', 'call', 'intro'],
    subject: 'Next step: Phone screen with Hudl India',
    body: `Hi {{first_name}},

Great news — after reviewing your application we'd love to set up a quick phone screen with you as the next step in our process.

Our recruiter will be in touch shortly to arrange a convenient time. The call typically lasts around 30 minutes and is a chance for us to learn more about your background and for you to ask any questions about the role and Hudl.

We look forward to speaking with you!

Best,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['technical', 'assessment', 'test', 'task', 'exercise', 'coding'],
    subject: 'Technical assessment — Hudl India',
    body: `Hi {{first_name}},

We're impressed with your profile and would like to invite you to complete a technical assessment as the next stage of our process.

Someone from our team will follow up shortly with the details, including the format, timeframe, and what to expect. Please don't hesitate to reach out if you have any questions beforehand.

Good luck — we're rooting for you!

Best,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['interview', 'first', 'video', 'virtual', 'meet'],
    subject: 'Interview invitation — Hudl India',
    body: `Hi {{first_name}},

We're pleased to invite you to an interview with our team here at Hudl India. This is a great opportunity for us to get to know you better and for you to find out more about the role and our culture.

Our team will reach out shortly to confirm the date, time, and format. Please let us know if you need any adjustments or have any questions in the meantime.

We look forward to meeting you!

Best,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['final', 'last', 'panel', 'senior', 'leadership'],
    subject: 'Final interview — Hudl India',
    body: `Hi {{first_name}},

Congratulations — you've made it to the final stage of our interview process at Hudl India! We've been really impressed with you throughout, and we're excited to continue the conversation.

Our team will be in touch shortly with all the details for your final interview. This is your chance to meet more of the team and ask any remaining questions you have about the role.

Well done on getting this far — we look forward to seeing you soon.

Best,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['offer', 'contract', 'hired', 'hire'],
    subject: 'Exciting news — your offer from Hudl India',
    body: `Hi {{first_name}},

We're thrilled to let you know that we'd like to make you an offer to join Hudl India!

Our recruiting team will be in touch very shortly with the full details of your offer. Please review everything carefully and don't hesitate to reach out with any questions — we're happy to discuss.

We're really excited about the prospect of you joining the team and hope you are too!

Warm regards,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['reference', 'referees', 'references'],
    subject: 'Reference check — Hudl India',
    body: `Hi {{first_name}},

We're at the reference check stage and would like to contact a couple of your professional referees. Could you please send us the names and contact details of two references who can speak to your recent work experience?

Please reply to this email with their details at your earliest convenience so we can keep things moving.

Thanks so much,
Hudl India Recruiting Team`,
  },
  {
    keywords: ['rejected', 'decline', 'unsuccessful', 'not', 'no'],
    subject: 'Your application to Hudl India',
    body: `Hi {{first_name}},

Thank you for taking the time to go through our interview process at Hudl India. We genuinely enjoyed getting to know you.

After careful consideration, we've decided to move forward with another candidate whose experience more closely matches our current needs. This was a difficult decision — the standard of candidates was very high.

We'll keep your details on file and encourage you to keep an eye on future opportunities at Hudl. We wish you every success in your search.

Kind regards,
Hudl India Recruiting Team`,
  },
]

const GENERIC_DEFAULT = {
  subject: 'An update on your Hudl India application — {{stage_name}}',
  body: `Hi {{first_name}},

We wanted to reach out with an update on your application with Hudl India.

You've moved to the {{stage_name}} stage of our process. Our team will be in touch shortly with more details on what to expect next.

If you have any questions in the meantime, please don't hesitate to get in touch.

Best,
Hudl India Recruiting Team`,
}

function getDefaultTemplate(stageName) {
  const lower = stageName.toLowerCase()
  const match = DEFAULTS.find((d) => d.keywords.some((kw) => lower.includes(kw)))
  return match ?? GENERIC_DEFAULT
}

function TemplateForm({ stage, existing, onSave, onCancel }) {
  const [subject, setSubject] = useState(existing?.subject ?? '')
  const [body, setBody] = useState(existing?.body ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const insertVariable = (variable) => {
    setBody((prev) => prev + variable)
  }

  const handleSave = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(stage.id, { subject: subject.trim(), body: body.trim(), enabled: existing?.enabled ?? true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Update on your Hudl application — {{stage_name}}"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hudl-orange/40 focus:border-hudl-orange"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder={`Hi {{first_name}},\n\nWe'd like to invite you to the next step in our process...`}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hudl-orange/40 focus:border-hudl-orange resize-y"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400">Insert variable:</span>
        {VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => insertVariable(v)}
            className="px-2 py-0.5 text-xs font-mono bg-orange-50 text-hudl-orange border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Save
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          <X size={12} />
          Cancel
        </Button>
      </div>
    </div>
  )
}

export function EmailTemplatesPage() {
  const { stages, loading: stagesLoading, fetchStages } = useStages()
  const { templates, loading: templatesLoading, fetchTemplates, upsertTemplate, deleteTemplate } =
    useEmailTemplates()
  const [editingStageId, setEditingStageId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetchStages()
    fetchTemplates()
  }, [fetchStages, fetchTemplates])

  const templateByStage = Object.fromEntries(templates.map((t) => [t.stage_id, t]))

  const handleSeedDefaults = async () => {
    setSeeding(true)
    try {
      const stagesToSeed = stages.filter((s) => !templateByStage[s.id])
      await Promise.all(
        stagesToSeed.map((s) => {
          const tpl = getDefaultTemplate(s.name)
          return upsertTemplate(s.id, { subject: tpl.subject, body: tpl.body, enabled: true })
        }),
      )
      await fetchTemplates()
    } finally {
      setSeeding(false)
    }
  }

  const handleSave = async (stageId, fields) => {
    await upsertTemplate(stageId, fields)
    await fetchTemplates()
    setEditingStageId(null)
  }

  const handleToggle = async (stage) => {
    const tpl = templateByStage[stage.id]
    if (!tpl) return
    setTogglingId(tpl.id)
    try {
      await upsertTemplate(stage.id, {
        subject: tpl.subject,
        body: tpl.body,
        enabled: !tpl.enabled,
      })
      await fetchTemplates()
    } finally {
      setTogglingId(null)
    }
  }

  const loading = stagesLoading || templatesLoading

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={20} className="text-hudl-orange" />
            <h1 className="text-xl font-bold text-hudl-dark">Email Templates</h1>
          </div>
          <p className="text-sm text-gray-500">
            Configure automated emails sent to candidates when they move to a new pipeline stage.
          </p>
        </div>
        {stages.some((s) => !templateByStage[s.id]) && (
          <Button variant="secondary" size="sm" onClick={handleSeedDefaults} disabled={seeding}>
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Suggest defaults
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-hudl-orange" size={24} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {stages.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              No pipeline stages found. Add stages in Stage Manager first.
            </div>
          )}
          {stages.map((stage) => {
            const tpl = templateByStage[stage.id]
            const isEditing = editingStageId === stage.id

            return (
              <div key={stage.id} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* Color dot */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />

                  {/* Stage name + template preview */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{stage.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {tpl ? tpl.subject : 'No template configured'}
                    </p>
                  </div>

                  {/* Enabled toggle (only when template exists) */}
                  {tpl && (
                    <button
                      onClick={() => handleToggle(stage)}
                      disabled={togglingId === tpl.id}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                      title={tpl.enabled ? 'Disable template' : 'Enable template'}
                    >
                      {togglingId === tpl.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : tpl.enabled ? (
                        <ToggleRight size={22} className="text-hudl-orange" />
                      ) : (
                        <ToggleLeft size={22} />
                      )}
                    </button>
                  )}

                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!p-2 shrink-0"
                    onClick={() => setEditingStageId(isEditing ? null : stage.id)}
                  >
                    {isEditing ? <X size={14} /> : <Pencil size={14} />}
                  </Button>
                </div>

                {isEditing && (
                  <TemplateForm
                    stage={stage}
                    existing={tpl}
                    onSave={handleSave}
                    onCancel={() => setEditingStageId(null)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
