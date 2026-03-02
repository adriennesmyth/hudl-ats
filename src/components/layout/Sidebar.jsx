import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GitBranch, ExternalLink } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stages', label: 'Stage Manager', icon: GitBranch },
]

export function Sidebar() {
  return (
    <aside className="w-60 bg-hudl-dark h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-hudl-orange rounded-lg flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Hudl Talent</p>
            <p className="text-gray-500 text-xs">Applicant Tracking</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-3 pb-2">
          Recruiting
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-hudl-orange text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-white/10">
        <a
          href="/apply"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ExternalLink size={16} />
          Application Form
        </a>
      </div>
    </aside>
  )
}
