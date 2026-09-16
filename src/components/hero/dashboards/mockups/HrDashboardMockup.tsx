import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { DonutWidget, KpiStrip, LeaveList, Panel } from '../mockupParts'
import type { DashboardMockupProps } from '../types'

export const HrDashboardMockup = memo(function HrDashboardMockup(_props: DashboardMockupProps) {
  const data = useDashboardRegionalData()
  const payroll = data.hrKpis?.[3]?.value ?? data.hrPayrollSummary?.[0]?.value ?? 'PKR 8.6M'

  return (
    <DashboardFrame moduleType="hr" title="HR Overview" subtitle="Employees, attendance and payroll summary">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: 'Employees', value: '128', hint: 'Across all branches', tone: 'muted' },
            { label: 'Present Today', value: '116', hint: '90.6% attendance', tone: 'up' },
            { label: 'Payroll', value: payroll, hint: 'This pay cycle', tone: 'muted' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Department Distribution">
            <DonutWidget
              center="128"
              centerSub="Staff"
              size={78}
              segments={[
                { label: 'Sales', value: 32, color: '#FF714A' },
                { label: 'Operations', value: 34, color: '#111936' },
                { label: 'Finance', value: 18, color: '#475569' },
                { label: 'Support', value: 16, color: '#94a3b8' },
              ]}
            />
          </Panel>
          <Panel title="Leave Requests">
            <LeaveList rows={data.hrLeaveRequests.slice(0, 5)} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})
