/** Visually hidden honeypot — leave empty. Server rejects filled values as bots. */
export function LeadHoneypot({
  value,
  onChange,
  id = 'lead-company-website',
}: {
  value: string
  onChange: (v: string) => void
  id?: string
}) {
  return (
    <div
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        type="text"
        name="company_website"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
