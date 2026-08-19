import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { posHourlySales, posTopProducts } from '../dashboardData'

import { KpiStrip, Panel, ProductRows, SparkAreaChart } from '../mockupParts'

import type { DashboardMockupProps } from '../types'

export const PosDashboardMockup = memo(function PosDashboardMockup(_props: DashboardMockupProps) {
  const products = posTopProducts.slice(0, 5).map((p, i) => ({
    name: p.name,
    qty: String(p.qty),
    icon: ['coffee', 'dates', 'water', 'bag', 'bag'][i],
  }))

  return (
    <DashboardFrame moduleType="pos" title="POS Overview" subtitle="Fast connected retail sales system">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: "Today's Sales", value: 'AED 132,760', hint: '+12% vs yesterday', tone: 'up' },
            { label: 'Transactions', value: '486', hint: 'Live across 12 tills', tone: 'muted' },
            { label: 'Average Basket', value: 'AED 273', hint: '+6.2% upsell rate', tone: 'up' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Hourly Sales">
            <SparkAreaChart
              values={posHourlySales.values.slice(0, 6)}
              labels={posHourlySales.labels.slice(0, 6)}
              color="#14b8a6"
            />
          </Panel>
          <Panel title="Top-Selling Products">
            <ProductRows items={products} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})