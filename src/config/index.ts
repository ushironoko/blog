export type Config = {
  port: number
  host: string
  origin: string
}

export function getConfig(): Config {
  const port = Number.parseInt(process.env.PORT || '3000')
  const host = process.env.HOST || 'localhost'
  const origin = process.env.ORIGIN || `http://${host}:${port}`

  return {
    port,
    host,
    origin,
  }
}
