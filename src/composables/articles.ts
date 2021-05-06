import { contentFunc, IContentDocument } from '@nuxt/content/types/content'
import { Ref } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'

function addTwitterLink(content: IContentDocument, baseURL: string) {
  const twitterLink = `https://twitter.com/intent/tweet?text=${content.title}%0a${baseURL}${content.path}`
  content.twitterLink = twitterLink
  return {
    ...content,
  }
}

export const useArticle = (
  $content: contentFunc,
  params: Ref<Route['params']>,
  baseURL: string
) => {
  const fetchArticle = async (): Promise<IContentDocument> => {
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

    const content = addTwitterLink(res, baseURL)

    return content
  }

  const fetchAllArticles = async (): Promise<IContentDocument[]> => {
    const res = await $content('articles', { deep: true })
      .sortBy('publishedAt', 'desc')
      .fetch()

    return !Array.isArray(res) ? [res] : res
  }

  return {
    fetchArticle,
    fetchAllArticles,
  }
}
