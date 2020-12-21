import { contentFunc, IContentDocument } from '@nuxt/content/types/content'
import { Ref } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'

export const fetchArticle = async (
  params: Ref<Route['params']>,
  $content: contentFunc
): Promise<IContentDocument> => {
  const { year, slug } = params.value
  const path = ['articles', year, slug].join('/')

  const page = await $content(path).fetch()

  if (Array.isArray(page)) {
    return Promise.reject(
      new Error(
        'Multiple Articles exist. Please fix it so that the content retrieved is unique.'
      )
    )
  }

  return page
}
