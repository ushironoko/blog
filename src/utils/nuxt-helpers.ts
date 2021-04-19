import { Module, ServerMiddleware, NuxtConfig } from '@nuxt/types'

export const defineNuxtModule = <T extends Record<string, unknown>>(
  module: Module<T>
) => module
export const defineNuxtServerMiddleware = (
  serverMiddleware: ServerMiddleware
) => serverMiddleware
export const defineNuxtConfig = (config: NuxtConfig) => config
