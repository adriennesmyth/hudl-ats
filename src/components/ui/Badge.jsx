export function Badge({ children, color = '#94A3B8', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  )
}

const RECOMMENDATION_LABELS = {
  strong_yes: { label: 'Strong Yes', color: '#16A34A' },
  yes: { label: 'Yes', color: '#65A30D' },
  neutral: { label: 'Neutral', color: '#CA8A04' },
  no: { label: 'No', color: '#EA580C' },
  strong_no: { label: 'Strong No', color: '#DC2626' },
}

export function RecommendationBadge({ value }) {
  const { label, color } = RECOMMENDATION_LABELS[value] ?? { label: value, color: '#94A3B8' }
  return <Badge color={color}>{label}</Badge>
}
