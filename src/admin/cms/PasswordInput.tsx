import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  wrapperClassName?: string
}

export function PasswordInput({ className = '', wrapperClassName = '', id, ...props }: Props) {
  const [show, setShow] = useState(false)
  const inputClass =
    'mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <div className={`relative ${wrapperClassName}`.trim()}>
      <input id={id} type={show ? 'text' : 'password'} className={`${inputClass} ${className}`.trim()} {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}
