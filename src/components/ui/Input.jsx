import { forwardRef } from 'react'

export const Input = forwardRef(function Input({ label, error, hint, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-hudl-orange ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`border rounded-lg px-3 py-2 text-sm bg-white transition-colors
          focus:outline-none focus:ring-2 focus:ring-hudl-orange/40 focus:border-hudl-orange
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-gray-300'}
          ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, hint, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-hudl-orange ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={4}
        className={`border rounded-lg px-3 py-2 text-sm bg-white transition-colors resize-none
          focus:outline-none focus:ring-2 focus:ring-hudl-orange/40 focus:border-hudl-orange
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select({ label, error, children, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-hudl-orange ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`border rounded-lg px-3 py-2 text-sm bg-white transition-colors
          focus:outline-none focus:ring-2 focus:ring-hudl-orange/40 focus:border-hudl-orange
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})
