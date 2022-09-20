import fs from 'fs'

export const getPrerenderTargets = ({
  baseURL,
  targetArticles,
  maxLength,
}: {
  baseURL: string
  targetArticles: string
  maxLength: number
}) => {
  const tmp = fs
    .readdirSync(`./src/content/${targetArticles}`)
    .reduce((acc, file) => {
      acc.push(file.replace('.md', ''))
      return acc
    }, [] as string[])
    .slice(0, maxLength)

  const fileNames = tmp.length <= maxLength ? tmp : tmp.slice(0, maxLength)

  return fileNames.map((fileName) => ({
    rel: 'prerender',
    href: `${baseURL}/${targetArticles}/${fileName}`,
  }))
}
