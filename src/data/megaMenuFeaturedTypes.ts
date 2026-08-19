export type MegaMenuFeaturedItem = {
  id: string
  slug: string
  to: string
  image: string
  imageAlt: string
}

export type MegaMenuFeaturedColumn = {
  id: string
  items: MegaMenuFeaturedItem[]
}
