import { memo } from 'react'
import type { HeroMockupSlideOverrides } from '../../../../../types/heroMockup'
import { AreaLineChart, DonutSplit } from '../charts/Charts'
import { ActivityList, AiInsightPanel, CompactList } from '../components/Widgets'
import { useDashboardRegionalData } from '../../useDashboardRegionalData'
import { MockV2Panel, MockV2Shell } from '../shell/MockV2Shell'
import { useMockV2Data } from '../useMockV2Data'
import { mockV2 } from '../tokens'

type Props = {
  animate?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}

export const HrMockupV2 = memo(function HrMockupV2({ animate = false, mockupData }: Props) {
  const data = useMockV2Data('hr', mockupData)
  const regional = useDashboardRegionalData()

  return (
    <MockV2Shell moduleType="hr" title={data.title} subtitle={data.subtitle} kpis={data.kpis} animate={animate}>
      <div className="dm-mock-v2__grid dm-mock-v2__grid--hr-main">
        <MockV2Panel title="Attendance Trend" className="dm-mock-v2__panel--primary">
          <AreaLineChart
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
            series={[
              { label: 'Present', color: mockV2.teal, values: [88, 90, 91, 89, 92, 78], area: true },
              { label: 'Expected', color: mockV2.blue, values: [86, 88, 88, 87, 90, 80] },
            ]}
            animate={animate}
            height={118}
          />
        </MockV2Panel>

        <MockV2Panel title="Workforce Distribution" className="dm-mock-v2__panel--side dm-mock-v2__panel--tablet-hide">
          <DonutSplit
            center="Team"
            segments={regional.hrDepartmentDonut.map((s, i) => ({
              label: s.label,
              value: s.value,
              color: [mockV2.teal, mockV2.blue, mockV2.navy, mockV2.body][i] ?? mockV2.teal,
            }))}
          />
        </MockV2Panel>
      </div>

      <div className="dm-mock-v2__grid dm-mock-v2__grid--hr-bottom">
        <MockV2Panel title="Payroll Status" className="dm-mock-v2__panel--tablet-hide">
          <CompactList
            items={regional.hrPayrollSummary.map((p) => ({
              label: p.label,
              value: p.value,
            }))}
          />
        </MockV2Panel>

        <MockV2Panel title="Employee Activity" className="dm-mock-v2__panel--tablet-hide">
          <ActivityList
            items={regional.hrLeaveRequests.slice(0, 3).map((r) => ({
              title: r.name,
              meta: r.type,
              amount: r.status,
              tone: r.status === 'Pending' ? 'warning' : 'positive',
            }))}
          />
        </MockV2Panel>

        <AiInsightPanel message={data.aiInsight.message} action={data.aiInsight.action} />
      </div>
    </MockV2Shell>
  )
})
