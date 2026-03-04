import { createClient } from '@supabase/supabase-js'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_ADDRESS = process.env.FROM_EMAIL || 'Hudl Talent <onboarding@resend.dev>'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL ?? '',
  process.env.VITE_SUPABASE_ANON_KEY ?? '',
)

function buildHtml(bodyText) {
  // Convert newlines to <br> for email display
  const bodyHtml = bodyText.replace(/\n/g, '<br>')
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#232a31;padding:28px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ff6300;width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;">
                  <span style="color:#ffffff;font-weight:700;font-size:16px;">H</span>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;color:#ffffff;font-weight:700;font-size:15px;">Hudl Talent</p>
                  <p style="margin:0;color:#9ca3af;font-size:12px;">Recruiting Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">${bodyHtml}</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              Hudl · 1414 South 11th St, Lincoln, NE 68502<br>
              You're receiving this because you applied for a role at Hudl.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function interpolate(text, vars) {
  return text
    .replace(/\{\{first_name\}\}/g, vars.first_name ?? '')
    .replace(/\{\{surname\}\}/g, vars.surname ?? '')
    .replace(/\{\{stage_name\}\}/g, vars.stage_name ?? '')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' })
  }

  const { candidateId, stageId } = req.body ?? {}
  if (!candidateId || !stageId) {
    return res.status(400).json({ error: 'Missing candidateId or stageId' })
  }

  // Fetch candidate
  const { data: candidate, error: candidateErr } = await supabase
    .from('candidates')
    .select('id, first_name, surname, email')
    .eq('id', candidateId)
    .single()

  if (candidateErr || !candidate) {
    return res.status(404).json({ error: 'Candidate not found' })
  }

  // Fetch enabled template for this stage (joined with stage name)
  const { data: template, error: templateErr } = await supabase
    .from('email_templates')
    .select('subject, body, stages(name)')
    .eq('stage_id', stageId)
    .eq('enabled', true)
    .single()

  if (templateErr || !template) {
    // No template configured — not an error
    return res.status(204).end()
  }

  const stageName = template.stages?.name ?? ''
  const vars = {
    first_name: candidate.first_name,
    surname: candidate.surname,
    stage_name: stageName,
  }

  const subject = interpolate(template.subject, vars)
  const body = interpolate(template.body, vars)

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: candidate.email,
      subject,
      html: buildHtml(body),
    }),
  })

  if (!emailRes.ok) {
    const err = await emailRes.text()
    return res.status(500).json({ error: `Resend error: ${err}` })
  }

  return res.status(200).json({ sent: true })
}
