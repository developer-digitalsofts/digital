import { memo } from 'react'
import type { HeroMockupSlideOverrides } from '../../../../../types/heroMockup'
import { AreaLineChart, HealthBars } from '../charts/Charts'
import { ActivityList, AiInsightPanel } from '../components/Widgets'
import { useDashboardRegionalData } from '../../useDashboardRegionalData'
import { MockV2Panel, MockV2Shell } from '../shell/MockV2Shell'
import { useMockV2Data } from '../useMockV2Data'
import { mockV2 } from '../tokens'

type Props = {
  animate?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}

export const ErpMockupV2 = memo(function ErpMockupV2({ animate = false, mockupData }: Props) {
  const data = useMockV2Data('erp', mockupData)
  const regional = useDashboardRegionalData()

  const labels = regional.erpRevenueTarget.labels
  const revenue = regional.erpRevenueTarget.actual
  const target = regional.erpRevenueTarget.target

  return (
    <MockV2Shell
      moduleType="erp"
      title={data.title}
      subtitle={data.subtitle}
      kpis={data.kpis}
      animate={animate}
      floatInsight={data.aiFloat}
    >
      <div className="dm-mock-v2__grid dm-mock-v2__grid--erp-main">
        <MockV2Panel
          title="Revenue & Profitability"
          className="dm-mock-v2__panel--primary"
          legend={
            <div className="dm-mock-v2__legend">
              <span><i style={{ background: mockV2.teal }} />Revenue</span>
              <span><i style={{ background: mockV2.blue }} />Target</span>
            </div>
          }
        >
          <AreaLineChart
            labels={labels}
            series={[
              { label: 'Revenue', color: mockV2.teal, values: revenue, area: true },
              { label: 'Target', color: mockV2.blue, values: target },
            ]}
            animate={animate}
            height={128}
          />
        </MockV2Panel>

        <MockV2Panel title="Business Health" className="dm-mock-v2__panel--side dm-mock-v2__panel--tablet-hide">
          <HealthBars
            items={[
              { label: 'Finance health', value: 92, tone: 'teal' },
              { label: 'Inventory availability', value: 88, tone: 'success' },
              { label: 'Sales pipeline', value: 76, tone: 'blue' },
              { label: 'Operations performance', value: 84, tone: 'teal' },
            ]}
          />
        </MockV2Panel>
      </div>

      <div className="dm-mock-v2__grid dm-mock-v2__grid--erp-bottom">
        <MockV2Panel title="Recent Activity" className="dm-mock-v2__panel--tablet-hide">
          <ActivityList
            items={regional.erpDocuments.rows.slice(0, 3).map((row) => {
              const status = row.status
              const tone =
                typeof status === 'object' && status?.tone === 'warning' ? 'warning' : 'default'
              return {
                title: String(row.doc),
                meta: String(row.branch),
                amount: String(row.amount),
                tone,
              }
            })}
          />
        </MockV2Panel>
        <AiInsightPanel message={data.aiInsight.message} action={data.aiInsight.action} />
      </div>
    </MockV2Shell>
  )
})
