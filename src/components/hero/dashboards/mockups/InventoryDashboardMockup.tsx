import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { BranchGrid, FillBarChart, KpiStrip, Panel } from '../mockupParts'
import type { DashboardMockupProps } from '../types'

export const InventoryDashboardMockup = memo(function InventoryDashboardMockup({ animate = false }: DashboardMockupProps) {
  const data = useDashboardRegionalData()
  const stockValue = data.inventoryKpis?.[1]?.value ?? data.inventorySalesWeek
  const movement = data.inventorySalesTrend.slice(0, 5)
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  return (
    <DashboardFrame moduleType="inventory" title="Inventory Overview" subtitle="Stock levels, movement and low-stock alerts">
      <DashboardBody>
        <KpiStrip
          items={[
            { label: 'Stock Value', value: stockValue, hint: '+5.4% this month', tone: 'up' },
            { label: 'Low Stock', value: '24', hint: 'Needs attention today', tone: 'warn' },
            { label: 'Accuracy', value: '97%', hint: 'On target', tone: 'up' },
          ]}
        />
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Stock Movement">
            <FillBarChart
              animate={animate}
              labels={labels}
              values={[movement, movement.map((v) => Math.max(8, Math.round(v * 0.72)))]}
              colors={['#FF714A', '#334155']}
              legend={['Inbound', 'Outbound']}
            />
          </Panel>
          <Panel title="Branch Stock Overview">
            <BranchGrid rows={data.inventoryBranchStock.slice(0, 4)} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})
