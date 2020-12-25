import { IContentDocument } from '@nuxt/content/types/content'
import { useContext } from '@nuxtjs/composition-api'
import { getOrigin } from '~/config/getOrigin'

export const fetchArticle = async (): Promise<IContentDocument> => {
  const { $content, params } = useContext()
  const origin = getOrigin()

  const { year, slug } = params.value
  const path = ['articles', year, slug].join('/')
  const res = await $content(path, {
    deep: true,
  }).fetch()

  if (Array.isArray(res)) {
    return Promise.reject(
      new Error(
        'Multiple Articles exist. Please fix it so that the content retrieved is unique.'
      )
    )
  }

  const content = addTwitterLink(res, origin)

  return content
}

export const fetchArticles = async (): Promise<IContentDocument[]> => {
  const { $content } = useContext()

  const res = await $content('articles', { deep: true })
    .sortBy('publishedAt', 'desc')
    .fetch()

  return !Array.isArray(res) ? [res] : res
}

function addTwitterLink(content: IContentDocument, origin: string) {
  const twitterLink = `https://twitter.com/intent/tweet?text=${content.title}%0a${origin}${content.path}`
  content.twitterLink = twitterLink
  return {
    ...content,
  }
}
