const RESEND_API_KEY = process.env.RESEND_API_KEY
const RECRUITER_EMAIL = process.env.RECRUITER_EMAIL
const FROM_ADDRESS = process.env.FROM_EMAIL || 'Hudl Talent <onboarding@resend.dev>'
const APP_URL = process.env.VITE_APP_URL || 'https://hudl-ats.vercel.app'

async function sendEmail(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${err}`)
  }
  return res.json()
}

function candidateEmail(candidate) {
  return {
    from: FROM_ADDRESS,
    to: candidate.email,
    subject: `We've received your application — Hudl`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1A1A1A;padding:28px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#FF6600;width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;">
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
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A1A1A;">
              Thanks for applying, ${candidate.first_name}!
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
              We've received your application and a member of our recruiting team will review it shortly.
              We'll be in touch if your experience looks like a great fit.
            </p>

            <!-- Summary box -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#fff7f0;border:1px solid #fed7aa;border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:600;color:#FF6600;text-transform:uppercase;letter-spacing:0.05em;">
                  Application Summary
                </p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#6b7280;width:40%;">Name</td>
                    <td style="padding:4px 0;font-size:13px;color:#1A1A1A;font-weight:500;">
                      ${candidate.first_name} ${candidate.surname}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#6b7280;">Email</td>
                    <td style="padding:4px 0;font-size:13px;color:#1A1A1A;font-weight:500;">${candidate.email}</td>
                  </tr>
                  ${candidate.education_level ? `
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#6b7280;">Education</td>
                    <td style="padding:4px 0;font-size:13px;color:#1A1A1A;font-weight:500;">${candidate.education_level}</td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 6px;font-size:14px;color:#6b7280;line-height:1.6;">
              <strong style="color:#1A1A1A;">What happens next?</strong><br>
              Our team typically reviews applications within 5 business days.
              If we'd like to move forward, you'll hear from us to schedule a call.
            </p>
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
</html>`,
  }
}

function recruiterEmail(candidate) {
  const profileUrl = `${APP_URL}/candidates/${candidate.id}`
  return {
    from: FROM_ADDRESS,
    to: RECRUITER_EMAIL,
    subject: `New application — ${candidate.first_name} ${candidate.surname}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1A1A1A;padding:28px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#FF6600;width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;">
                  <span style="color:#ffffff;font-weight:700;font-size:16px;">H</span>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;color:#ffffff;font-weight:700;font-size:15px;">Hudl Talent</p>
                  <p style="margin:0;color:#9ca3af;font-size:12px;">New Application Alert</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1A1A1A;">New application received</p>
            <p style="margin:0 0 28px;font-size:15px;color:#6b7280;">
              ${candidate.first_name} ${candidate.surname} just submitted an application.
            </p>

            <!-- Candidate details -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:600;color:#FF6600;text-transform:uppercase;letter-spacing:0.05em;">
                  Candidate Details
                </p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  ${[
                    ['Name', `${candidate.first_name} ${candidate.surname}`],
                    ['Email', candidate.email],
                    ['Education', candidate.education_level],
                    ['Address', candidate.address],
                    ['Referred By', candidate.referred_by],
                    ['LinkedIn', candidate.linkedin_url],
                    ['CV', candidate.cv_url ? '<a href="' + candidate.cv_url + '" style="color:#FF6600;">Download CV</a>' : null],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => `
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#6b7280;width:30%;vertical-align:top;">${label}</td>
                    <td style="padding:5px 0;font-size:13px;color:#1A1A1A;font-weight:500;">${value}</td>
                  </tr>`).join('')}
                </table>
              </td></tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#FF6600;border-radius:10px;">
                  <a href="${profileUrl}"
                    style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">
                    View Candidate Profile →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              Hudl ATS · Internal recruiting tool
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' })
  }

  const candidate = req.body

  if (!candidate?.email || !candidate?.first_name) {
    return res.status(400).json({ error: 'Missing candidate data' })
  }

  const results = { candidate: null, recruiter: null }
  const errors = []

  // Send candidate confirmation
  try {
    results.candidate = await sendEmail(candidateEmail(candidate))
  } catch (err) {
    errors.push(`Candidate email: ${err.message}`)
  }

  // Send recruiter notification
  if (RECRUITER_EMAIL) {
    try {
      results.recruiter = await sendEmail(recruiterEmail(candidate))
    } catch (err) {
      errors.push(`Recruiter email: ${err.message}`)
    }
  }

  if (errors.length > 0) {
    return res.status(207).json({ results, errors })
  }

  return res.status(200).json({ results })
}
