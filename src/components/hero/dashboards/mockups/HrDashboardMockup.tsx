import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { DonutWidget, KpiStrip, LeaveList, Panel } from '../mockupParts'
import type { DashboardMockupProps } from '../types'

export const HrDashboardMockup = memo(function HrDashboardMockup(_props: DashboardMockupProps) {
  const data = useDashboardRegionalData()

  return (
    <DashboardFrame moduleType="hr" title="HR Overview" subtitle="Workforce, attendance and payroll">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: 'Active Employees', value: '128', hint: 'Across all branches', tone: 'muted' },
            { label: 'Present Today', value: '116', hint: '90.6% attendance', tone: 'up' },
            { label: 'On Leave', value: '7', hint: '3 pending approval', tone: 'warn' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Department Distribution">
            <DonutWidget center="128 staff" centerSub="5 departments" segments={data.hrDepartmentDonut} size={76} />
          </Panel>
          <Panel title="Leave Requests">
            <LeaveList rows={data.hrLeaveRequests.slice(0, 5)} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})
