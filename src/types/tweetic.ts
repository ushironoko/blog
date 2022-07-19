/* eslint-disable camelcase */

export type TweeticParams = {
  layout: '' | 'supabase'
  url: string
}

export type TweeticResponse = {
  html: string
  meta: {
    url: string
    author_name: string
    author_url: string
    html: string
    width: number | null
    height: number | null
    type: string
    cache_age: string
    provider_name: string
    provider_url: string
    version: string
  }
}
