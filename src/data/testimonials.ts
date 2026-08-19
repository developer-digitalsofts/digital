export type Testimonial = {
  id: string
  contentKey: string
  avatar: string
}

/** Placeholder portrait URLs — replace with approved customer photos when available. */
export const testimonials: Testimonial[] = [
  {
    id: 'fahad',
    contentKey: 'fahad',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'ayesha',
    contentKey: 'ayesha',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'usman',
    contentKey: 'usman',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'sara',
    contentKey: 'sara',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'bilal',
    contentKey: 'bilal',
    avatar:
      'https://images.unsplash.com/photo-1519085368723-26608150952e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'nadia',
    contentKey: 'nadia',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  },
]

export function testimonialPairSlides(items: Testimonial[]): Testimonial[][] {
  const slides: Testimonial[][] = []
  for (let i = 0; i < items.length; i += 2) {
    slides.push(items.slice(i, i + 2))
  }
  return slides
}

export const testimonialPairCount = testimonialPairSlides(testimonials).length
