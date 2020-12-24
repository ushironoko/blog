export const getOrigin = () => {
  const port = process.env.PORT || '3000'
  const host = process.env.HOST || 'localhost'
  return process.env.ORIGIN || `http://${host}:${port}`
}
