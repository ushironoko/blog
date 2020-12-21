import { contentFunc } from '@nuxt/content/types/content'

export const fetchArticle = async (
  year: string,
  slug: string,
  $content: contentFunc
) => {
  const path = ['articles', year, slug].join('/')

  const page = await $content(path).fetch()

  if (Array.isArray(page)) {
    return Promise.reject(
      new Error('ArticleRepository: fetched multiple pages')
    )
  }

  return page
}
