import { IContentDocument } from '@nuxt/content/types/content'
import { useContext } from '@nuxtjs/composition-api'

export const fetchArticle = async (): Promise<IContentDocument> => {
  const { $content, params } = useContext()

  const { year, slug } = params.value
  const path = ['articles', year, slug].join('/')
  const content = await $content(path, { deep: true }).fetch()

  console.log(content)

  if (Array.isArray(content)) {
    return Promise.reject(
      new Error(
        'Multiple Articles exist. Please fix it so that the content retrieved is unique.'
      )
    )
  }

  return content
}

export const fetchArticles = async (): Promise<IContentDocument[]> => {
  const { $content } = useContext()

  const res = await $content('articles', { deep: true })
    .sortBy('createdAt', 'desc')
    .fetch()

  return !Array.isArray(res) ? [res] : res
}
