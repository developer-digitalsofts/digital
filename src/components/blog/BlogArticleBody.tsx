import type { Lang } from '../../i18n/messages'
import type { BlogBlock } from '../../types/blogContent'
import { resolvePublicMediaUrl } from '../../cms/publicMediaUrl'
import { pick } from '../../cms/pick'

type Props = {
  blocks: BlogBlock[]
  lang: Lang
}

export function BlogArticleBody({ blocks, lang }: Props) {
  return (
    <div className="blog-article__body">
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={block.id}>{pick(block.text, lang)}</p>
          case 'heading2':
            return <h2 key={block.id}>{pick(block.text, lang)}</h2>
          case 'heading3':
            return <h3 key={block.id}>{pick(block.text, lang)}</h3>
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
