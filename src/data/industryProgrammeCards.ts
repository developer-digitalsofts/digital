import type { LucideIcon } from 'lucide-react'
import {
  Bird,
  Building2,
  Factory,
  FileText,
  Flame,
  Fuel,
  GraduationCap,
  HardHat,
  Landmark,
  Milk,
  Store,
  Truck,
  Wheat,
  Wrench,
} from 'lucide-react'
import { softwarePath } from '../utils/slug'

export type IndustryProgrammeCard = {
  cardKey:
    | 'petrol'
    | 'general'
    | 'fbr'
    | 'poultry'
    | 'dairy'
    | 'lpg'
    | 'installment'
    | 'manuf'
    | 'trading'
    | 'retail'
    | 'water'
    | 'workshop'
    | 'school'
    | 'realestate'
    | 'service'
  icon: LucideIcon
  exploreTo: string
}

/** Home “Industry ERP programmes” — each Explore opens the closest product page from mega menu. */
export const industryProgrammeCards: IndustryProgrammeCard[] = [
  {
    cardKey: 'petrol',
    icon: Fuel,
    exploreTo: softwarePath('industry', 'petrol-pump-software'),
  },
  {
    cardKey: 'general',
    icon: Store,
    exploreTo: softwarePath('industry', 'retail-management-software'),
  },
  {
    cardKey: 'fbr',
    icon: FileText,
    exploreTo: softwarePath('module', 'fbr-pos-integration-software'),
  },
  {
    cardKey: 'poultry',
    icon: Bird,
    exploreTo: softwarePath('industry', 'poultry-control-shed-management-software'),
  },
  {
    cardKey: 'dairy',
    icon: Milk,
    exploreTo: softwarePath('industry', 'dairy-farm-management-software'),
  },
  {
    cardKey: 'lpg',
    icon: Flame,
    exploreTo: softwarePath('industry', 'lpg-business-software'),
  },
  {
    cardKey: 'installment',
    icon: Landmark,
    exploreTo: softwarePath('industry', 'erp-software-for-real-estate-business'),
  },
  {
    cardKey: 'manuf',
    icon: Factory,
    exploreTo: softwarePath('industry', 'garments-manufacturing-software'),
  },
  {
    cardKey: 'trading',
    icon: Truck,
    exploreTo: softwarePath('industry', 'logistics-transportation-software'),
  },
  {
    cardKey: 'retail',
    icon: Store,
    exploreTo: softwarePath('industry', 'grocery-store-management-software'),
  },
  {
    cardKey: 'water',
    icon: Wheat,
    exploreTo: softwarePath('industry', 'motor-market-management-software'),
  },
  {
    cardKey: 'workshop',
    icon: Wrench,
    exploreTo: softwarePath('industry', 'auto-parts-business-software'),
  },
  {
    cardKey: 'school',
    icon: GraduationCap,
    exploreTo: '/contact#contact-form',
  },
  {
    cardKey: 'realestate',
    icon: Building2,
    exploreTo: softwarePath('industry', 'erp-software-for-real-estate-business'),
  },
  {
    cardKey: 'service',
    icon: HardHat,
    exploreTo: softwarePath('industry', 'erp-software-for-construction-business'),
  },
]
