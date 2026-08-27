import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { CompactTable, FillBarChart, KpiStrip, Panel, renderStatusCell } from '../mockupParts'
import type { DashboardMockupProps } from '../types'

export const FinanceDashboardMockup = memo(function FinanceDashboardMockup({ animate = false }: DashboardMockupProps) {
  const data = useDashboardRegionalData()
  const labels = data.financeGroupedBars.labels.slice(0, 5)
  const revenue = data.financeGroupedBars.revenue.slice(0, 5)
  const expenses = data.financeGroupedBars.expenses.slice(0, 5)

  return (
    <DashboardFrame moduleType="finance" title="Finance Overview" subtitle="Real-time revenue and cash flow">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: 'Revenue', value: data.financeRevenueKpi, hint: '+8.2% this month', tone: 'up' },
            { label: 'Net Profit', value: data.financeNetProfitKpi, hint: '+14.6% vs target', tone: 'up' },
            { label: 'Cash Balance', value: data.financeCashKpi, hint: 'Available liquidity', tone: 'muted' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Revenue vs Expenses">
            <FillBarChart
              animate={animate}
              labels={labels}
              values={[revenue, expenses]}
              colors={['#FF714A', '#64748b']}
              legend={['Revenue', 'Expenses']}
            />
          </Panel>
          <Panel title="Recent Transactions">
            <CompactTable
              columns={['Reference', 'Account', 'Amount', 'Status']}
              rows={data.financeTransactions.rows.slice(0, 5).map((row) => [
                String(row.ref),
                String(row.account),
                String(row.amount),
                renderStatusCell(row.status),
              ])}
            />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})
