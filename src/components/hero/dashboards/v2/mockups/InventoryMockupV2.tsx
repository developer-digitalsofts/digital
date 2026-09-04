import { memo } from 'react'
import type { HeroMockupSlideOverrides } from '../../../../../types/heroMockup'
import { AreaLineChart, DonutSplit, HealthBars } from '../charts/Charts'
import { AiInsightPanel, CompactList } from '../components/Widgets'
import { useDashboardRegionalData } from '../../useDashboardRegionalData'
import { MockV2Panel, MockV2Shell } from '../shell/MockV2Shell'
import { useMockV2Data } from '../useMockV2Data'
import { mockV2 } from '../tokens'

type Props = {
  animate?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}

export const InventoryMockupV2 = memo(function InventoryMockupV2({ animate = false, mockupData }: Props) {
  const data = useMockV2Data('inventory', mockupData)
  const regional = useDashboardRegionalData()

  return (
    <MockV2Shell moduleType="inventory" title={data.title} subtitle={data.subtitle} kpis={data.kpis} animate={animate}>
      <div className="dm-mock-v2__grid dm-mock-v2__grid--inventory-main">
        <MockV2Panel title="Stock Movement Trend" className="dm-mock-v2__panel--primary">
          <AreaLineChart
            labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']}
            series={[{ label: 'Movement', color: mockV2.teal, values: regional.inventorySalesTrend, area: true }]}
            animate={animate}
            height={118}
          />
        </MockV2Panel>

        <MockV2Panel title="Category Distribution" className="dm-mock-v2__panel--side dm-mock-v2__panel--tablet-hide">
          <DonutSplit
            center="Stock"
            segments={[
              { label: 'Electronics', value: 34, color: mockV2.teal },
              { label: 'Grocery', value: 28, color: mockV2.blue },
              { label: 'Apparel', value: 22, color: mockV2.navy },
              { label: 'Other', value: 16, color: mockV2.body },
            ]}
          />
        </MockV2Panel>
      </div>

      <div className="dm-mock-v2__grid dm-mock-v2__grid--inventory-bottom">
        <MockV2Panel title="Inventory Health" className="dm-mock-v2__panel--tablet-hide">
          <HealthBars
            items={regional.inventoryWarehouses.map((w) => ({
              label: w.name,
              value: w.value,
              tone: w.value >= 90 ? 'success' : 'teal',
            }))}
          />
        </MockV2Panel>

        <MockV2Panel title="Restock Recommendations" className="dm-mock-v2__panel--tablet-hide">
          <CompactList
            items={regional.inventoryPosProducts.slice(0, 4).map((p, i) => ({
              label: p.name,
              value: `${p.qty} units`,
              hint: i < 2 ? 'Reorder soon' : undefined,
            }))}
          />
        </MockV2Panel>

        <AiInsightPanel message={data.aiInsight.message} action={data.aiInsight.action} />
      </div>
    </MockV2Shell>
  )
})
