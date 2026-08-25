import type { Lang } from '../../i18n/messages'
import type { BlogBlock } from '../../types/blogContent'
import { resolvePublicMediaUrl } from '../../cms/publicMediaUrl'
import { pick } from '../../cms/pick'

type Props = {
  blocks: BlogBlock[]
  lang: Lang
  headingIds?: { id: string; text: string; level: 2 | 3 }[]
}

export function BlogArticleBody({ blocks, lang, headingIds = [] }: Props) {
  let headingIndex = 0

  return (
    <div className="blog-article__body">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={block.id}>{pick(block.text, lang)}</p>
          case 'heading2':
          case 'heading3': {
            const tocId = headingIds[headingIndex]?.id
            if (block.type === 'heading2' || block.type === 'heading3') headingIndex += 1
            const Tag = block.type === 'heading2' ? 'h2' : 'h3'
            return (
              <Tag key={block.id} id={tocId}>
                {pick(block.text, lang)}
              </Tag>
            )
          }
          case 'bulletList':
            return (
              <ul key={block.id}>
                {block.items.map((item, i) => (
                  <li key={`${block.id}-${i}`}>{pick(item, lang)}</li>
                ))}
              </ul>
            )
          case 'numberedList':
            return (
              <ol key={block.id}>
                {block.items.map((item, i) => (
                  <li key={`${block.id}-${i}`}>{pick(item, lang)}</li>
                ))}
              </ol>
            )
          case 'quote':
            return (
              <blockquote key={block.id} className="blog-article__quote">
                <p>{pick(block.text, lang)}</p>
                {block.attribution ? <cite>{pick(block.attribution, lang)}</cite> : null}
              </blockquote>
            )
          case 'image': {
            const src = resolvePublicMediaUrl(block.src)
            if (!src) return null
            return (
              <figure key={block.id} className="blog-article__figure">
                <img src={src} alt={block.alt ? pick(block.alt, lang) : ''} loading="lazy" />
                {block.caption ? <figcaption>{pick(block.caption, lang)}</figcaption> : null}
              </figure>
            )
          }
          case 'cta':
            return (
              <aside key={block.id} className="blog-article__cta">
                {block.heading ? <h3>{pick(block.heading, lang)}</h3> : null}
                {block.description ? <p>{pick(block.description, lang)}</p> : null}
                {block.href && block.label ? (
                  <a href={block.href} className="blog-article__cta-btn">
                    {pick(block.label, lang)}
                  </a>
                ) : null}
              </aside>
            )
          case 'divider':
            return <hr key={block.id} className="blog-article__divider" />
          default:
            return null
        }
      })}
    </div>
  )
}
