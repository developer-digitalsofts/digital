import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { erpBranchPerformance, erpRevenueTarget } from '../dashboardData'

import { BranchProgressList, FillBarChart, KpiStrip, Panel } from '../mockupParts'

import type { DashboardMockupProps } from '../types'

export const ErpDashboardMockup = memo(function ErpDashboardMockup({ animate = false }: DashboardMockupProps) {
  const labels = erpRevenueTarget.labels.slice(0, 5)
  const actual = erpRevenueTarget.actual.slice(0, 5)
  const target = erpRevenueTarget.target.slice(0, 5)

  return (
    <DashboardFrame moduleType="erp" title="ERP Overview" subtitle="Executive business dashboard">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: 'Revenue', value: 'AED 2.4M', hint: '+8.2% vs last month', tone: 'up' },
            { label: 'Gross Profit', value: 'AED 612K', hint: '+11.3% margin growth', tone: 'up' },
            { label: 'Receivables', value: 'AED 318K', hint: 'Due within 30 days', tone: 'warn' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Revenue vs Target">
            <FillBarChart
              animate={animate}
              labels={labels}
              values={[actual, target]}
              colors={['#FF714A', '#111936']}
              legend={['Actual', 'Target']}
            />
          </Panel>
          <Panel title="Branch Performance">
            <BranchProgressList rows={erpBranchPerformance.slice(0, 4)} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})