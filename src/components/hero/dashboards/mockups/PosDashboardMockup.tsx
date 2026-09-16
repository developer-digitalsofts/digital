import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { DonutWidget, KpiStrip, Panel, SparkAreaChart } from '../mockupParts'
import type { DashboardMockupProps } from '../types'

export const PosDashboardMockup = memo(function PosDashboardMockup(_props: DashboardMockupProps) {
  const data = useDashboardRegionalData()

  return (
    <DashboardFrame moduleType="pos" title="POS Overview" subtitle="Daily sales, tills and payment mix">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: "Today's Sales", value: data.posTodayKpi, hint: '+12% vs yesterday', tone: 'up' },
            { label: 'Transactions', value: '486', hint: 'Live across 12 tills', tone: 'muted' },
            { label: 'Average Basket', value: data.posBasketKpi, hint: '+6.2% upsell rate', tone: 'up' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Hourly Sales">
            <SparkAreaChart
              values={data.posHourlySales.values.slice(0, 6)}
              labels={data.posHourlySales.labels.slice(0, 6)}
              color="#FF714A"
            />
          </Panel>
          <Panel title="Payment Mix">
            <DonutWidget
              center="100%"
              centerSub="Today"
              size={82}
              segments={[
                { label: 'Card', value: 52, color: '#FF714A' },
                { label: 'Cash', value: 31, color: '#111936' },
                { label: 'Wallet', value: 17, color: '#94a3b8' },
              ]}
            />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})
