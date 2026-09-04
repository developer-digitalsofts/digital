import { memo } from 'react'
import type { HeroMockupSlideOverrides } from '../../../../../types/heroMockup'
import { AreaLineChart, BarComparisonChart, DonutSplit } from '../charts/Charts'
import { AiInsightPanel } from '../components/Widgets'
import { useDashboardRegionalData } from '../../useDashboardRegionalData'
import { MockV2Panel, MockV2Shell } from '../shell/MockV2Shell'
import { useMockV2Data } from '../useMockV2Data'
import { mockV2 } from '../tokens'

type Props = {
  animate?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}

export const FinanceMockupV2 = memo(function FinanceMockupV2({ animate = false, mockupData }: Props) {
  const data = useMockV2Data('finance', mockupData)
  const regional = useDashboardRegionalData()
  const bars = regional.financeGroupedBars

  return (
    <MockV2Shell
      moduleType="finance"
      title={data.title}
      subtitle={data.subtitle}
      kpis={data.kpis}
      animate={animate}
      floatInsight={data.aiFloat}
    >
      <div className="dm-mock-v2__grid dm-mock-v2__grid--finance-main">
        <MockV2Panel title="Cash-flow Forecast" className="dm-mock-v2__panel--primary">
          <AreaLineChart
            labels={bars.labels}
            series={[
              { label: 'Cash', color: mockV2.coral, values: [52, 58, 54, 62, 68, 72], area: true },
              { label: 'Outflow', color: mockV2.amber, values: [38, 42, 40, 44, 46, 48] },
            ]}
            animate={animate}
            height={120}
          />
        </MockV2Panel>

        <MockV2Panel title="Revenue vs Expenses" className="dm-mock-v2__panel--side">
          <BarComparisonChart
            labels={bars.labels.slice(0, 4)}
            a={bars.revenue.slice(0, 4)}
            b={bars.expenses.slice(0, 4)}
            aLabel="Revenue"
            bLabel="Expenses"
            animate={animate}
          />
        </MockV2Panel>
      </div>

      <div className="dm-mock-v2__grid dm-mock-v2__grid--finance-bottom">
        <MockV2Panel title="Aging Summary" className="dm-mock-v2__panel--tablet-hide">
          <DonutSplit
            center="A/R"
            segments={regional.financeAgingDonut.map((s) => ({
              label: s.label,
              value: s.value,
              color: s.label.includes('90')
                ? mockV2.error
                : s.label.includes('31')
                  ? mockV2.amber
                  : s.label.includes('0')
                    ? mockV2.coral
                    : mockV2.coralSoft,
            }))}
          />
        </MockV2Panel>
        <AiInsightPanel message={data.aiInsight.message} action={data.aiInsight.action} />
      </div>
    </MockV2Shell>
  )
})
