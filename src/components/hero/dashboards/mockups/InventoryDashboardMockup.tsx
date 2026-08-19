import { memo } from 'react'
import { DashboardBody, DashboardFrame } from '../DashboardFrame'
import { inventoryBranchStock, inventoryPosProducts, inventorySalesTrend } from '../dashboardData'

import { AlertStat, BranchGrid, GaugeWidget, Panel, ProductRows, SparkAreaChart } from '../mockupParts'

import type { DashboardMockupProps } from '../types'

export const InventoryDashboardMockup = memo(function InventoryDashboardMockup(_props: DashboardMockupProps) {
  return (
    <DashboardFrame moduleType="inventory" title="Inventory & POS" subtitle="Real-time inventory and point of sale overview">
      <DashboardBody>
        <div className="dm-hero__kpi-row">
          <div className="dm-hero__kpi-tile dm-hero__kpi-tile--mint">
            <p className="dm-hero__kpi-label">Stock Health</p>
            <GaugeWidget value={97} label="On target" sublabel="+4% vs last week" />
          </div>
          <div className="dm-hero__kpi-tile dm-hero__kpi-tile--peach">
            <p className="dm-hero__kpi-label">Sales (This Week)</p>
            <p className="dm-hero__kpi-value">AED 245,300</p>
            <SparkAreaChart values={inventorySalesTrend.slice(0, 6)} color="#FF714A" />
            <p className="dm-hero__kpi-hint">+12.4% vs last week</p>
          </div>
          <div className="dm-hero__kpi-tile dm-hero__kpi-tile--rose">
            <p className="dm-hero__kpi-label">Low Stock Items</p>
            <AlertStat value="24" label="Needs attention today" />
          </div>
        </div>
        <div className="dm-hero__split dm-hero__split--2">
          <Panel title="Top Selling Products">
            <ProductRows items={inventoryPosProducts.slice(0, 5)} />
          </Panel>
          <Panel title="Branch Stock Overview">
            <BranchGrid rows={inventoryBranchStock.slice(0, 4)} />
          </Panel>
        </div>
      </DashboardBody>
    </DashboardFrame>
  )
})