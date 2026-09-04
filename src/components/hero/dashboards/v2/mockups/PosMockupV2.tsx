import { memo } from 'react'
import type { HeroMockupSlideOverrides } from '../../../../../types/heroMockup'
import { AreaLineChart, DonutSplit } from '../charts/Charts'
import { AiInsightPanel, CompactList, TillStatus } from '../components/Widgets'
import { useDashboardRegionalData } from '../../useDashboardRegionalData'
import { MockV2Panel, MockV2Shell } from '../shell/MockV2Shell'
import { useMockV2Data } from '../useMockV2Data'
import { mockV2 } from '../tokens'

type Props = {
  animate?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}

export const PosMockupV2 = memo(function PosMockupV2({ animate = false, mockupData }: Props) {
  const data = useMockV2Data('pos', mockupData)
  const regional = useDashboardRegionalData()
  const hourly = regional.posHourlySales

  return (
    <MockV2Shell moduleType="pos" title={data.title} subtitle={data.subtitle} kpis={data.kpis} animate={animate}>
      <div className="dm-mock-v2__grid dm-mock-v2__grid--pos-main">
        <MockV2Panel title="Hourly Sales" className="dm-mock-v2__panel--primary">
          <AreaLineChart
            labels={hourly.labels}
            series={[{ label: 'Sales', color: mockV2.teal, values: hourly.values, area: true }]}
            animate={animate}
            height={118}
          />
        </MockV2Panel>

        <MockV2Panel title="Channel / Payment Split" className="dm-mock-v2__panel--side dm-mock-v2__panel--tablet-hide">
          <DonutSplit
            center="Pay"
            segments={[
              { label: 'Card', value: 44, color: mockV2.teal },
              { label: 'Cash', value: 32, color: mockV2.blue },
              { label: 'Wallet', value: 16, color: mockV2.navy },
              { label: 'Other', value: 8, color: mockV2.body },
            ]}
          />
        </MockV2Panel>
      </div>

      <div className="dm-mock-v2__grid dm-mock-v2__grid--pos-bottom">
        <MockV2Panel title="Top Products" className="dm-mock-v2__panel--tablet-hide">
          <CompactList
            items={regional.posTopProducts.slice(0, 4).map((p) => ({
              label: p.name,
              value: `${p.qty} sold`,
            }))}
          />
        </MockV2Panel>

        <MockV2Panel title="Live Till Status" className="dm-mock-v2__panel--tablet-hide">
          <TillStatus
            items={[
              { label: 'Active', count: 12, tone: 'live' },
              { label: 'Idle', count: 2, tone: 'idle' },
              { label: 'Offline', count: 1, tone: 'offline' },
            ]}
          />
        </MockV2Panel>

        <AiInsightPanel message={data.aiInsight.message} action={data.aiInsight.action} />
      </div>
    </MockV2Shell>
  )
})
