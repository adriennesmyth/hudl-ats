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
        <svg viewBox="0 0 87.2 28.5" height="20" aria-label="Hudl" className="mb-1">
          <path fill="#ff6300" d="M14.5 4.6c-1.8-1.5-4-2.6-6.4-3q-.9.45-1.8 1.2h-.1C4.1 2.2 1.8 3.1.7 5c-1.2 2-.7 4.5.8 6v.1c-.1.6-.1 1.2-.1 1.8 0 3.5 1.4 6.6 3.7 9 .1.1.2 0 .2-.1-.5-1.4-.8-2.8-.8-4.4 0-1.8.4-3.4 1-4.9 0 0 0-.1.1-.1 1.4-.2 2.8-1 3.6-2.4.5-1 .6-2 .5-3v-.1c1.4-1 3-1.7 4.7-2.1.2 0 .2-.2.1-.2"/>
          <path fill="#ff6300" d="M6.9 16.7c-.5 2.3-.3 4.8.6 7.1.6.4 1.3.7 1.9.9l.1.1c.5 2.1 2.4 3.7 4.7 3.7s4.2-1.6 4.7-3.7c0 0 0-.1.1-.1.5-.2 1.1-.5 1.6-.8 3-1.7 5.1-4.5 5.9-7.6 0-.1-.1-.2-.2-.1-.9 1.1-2.1 2.1-3.4 2.9-1.5.9-3.1 1.4-4.8 1.6H18c-.9-1.1-2.3-1.9-3.8-1.9-1.1 0-2 .3-2.8.9h-.1q-2.4-1.05-4.2-3c0-.1-.1-.1-.2 0"/>
          <path fill="#ff6300" d="M21.2 17.2c2.2-.8 4.3-2.2 5.8-4.1 0-.7 0-1.4-.1-2.1v-.1c1.6-1.5 2-4 .8-5.9-1.1-2-3.5-2.8-5.6-2.2H22c-.5-.4-1-.7-1.5-1C17.5.1 14-.3 10.9.5c-.1 0-.1.2 0 .2q2.1.45 4.2 1.5c1.5.9 2.8 2 3.8 3.3v.1c-.5 1.3-.5 2.9.3 4.3.5.9 1.3 1.6 2.2 2 0 0 .1 0 .1.1.2 1.7 0 3.4-.5 5.1.1.1.1.1.2.1"/>
          <path fill="white" d="M40.8 24.7v-9.6c0-1-.5-1.6-1.7-1.6-.4 0-.8.1-1.2.2v11h-5.5V2.6H38v7.2c.8-.3 1.7-.5 2.7-.5 3.7 0 5.6 1.9 5.6 5.2v10.2zm14.8.4c-4.7 0-7-1.7-7-5.9V9.5h5.5v9.7c0 1 .5 1.4 1.5 1.4.5 0 .9-.1 1.2-.1v-11h5.5v14.4c-1.5.7-4.2 1.2-6.7 1.2m16.9 0c-5.2 0-8-2.8-8-8 0-4.7 2.4-7.7 7.2-7.7.5 0 1.2.1 1.6.2v-7h5.5V24c-1.3.6-3.6 1.1-6.3 1.1m.8-11.5c-.2-.1-.6-.2-1-.2-1.5 0-2.3 1.4-2.3 3.6 0 2.6.8 3.8 2.4 3.8.4 0 .7 0 .9-.1zm8.3 11.1V2.6h5.5v22.1z"/>
        </svg>
        <p className="text-gray-500 text-xs">Applicant Tracking</p>
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
