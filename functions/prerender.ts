import fs from 'fs'

export const preloadHtmlList = ({
  baseURL,
  targetArticles,
}: {
  baseURL: string
  targetArticles: string
}) => {
  const fileNames = fs
    .readdirSync(`./src/content/${targetArticles}`)
    .reduce((acc, file) => {
      acc.push(file.replace('.md', ''))
      return acc
    }, [] as string[])

  return fileNames.map((fileName) => ({
    rel: 'prerender',
    href: `${baseURL}/${targetArticles}/${fileName}`,
  }))
}
