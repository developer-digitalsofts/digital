import type { TableColumn, TableRow, BadgeTone } from './types'
import { StatusBadge } from './StatusBadge'

function cellValue(value: string | { text: string; tone?: BadgeTone }) {
  if (typeof value === 'string') return value
  return <StatusBadge tone={value.tone}>{value.text}</StatusBadge>
}

export function DataTable({ columns, rows }: { columns: TableColumn[]; rows: TableRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
      <table className="w-full text-[8px] sm:text-[9px] lg:text-[10px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-2 py-1.5 font-semibold lg:px-2.5 lg:py-2 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-2 py-1.5 lg:px-2.5 lg:py-2 ${col.align === 'right' ? 'text-right font-medium' : 'text-left'} ${
                    col.key === 'doc' || col.key === 'ref' || col.key === 'receipt' || col.key === 'employee' ? 'font-semibold text-brand-deep' : ''
                  }`}
                >
                  {cellValue(row[col.key] as string | { text: string; tone?: BadgeTone })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
