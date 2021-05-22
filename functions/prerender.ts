import fs from 'fs'

const rel = 'prerender'
const targetArticles = 'articles/2021'
const baseURL = process.env.ORIGIN || 'http://localhost:3000'

const fileNames = fs
  .readdirSync(`./src/content/${targetArticles}`)
  .reduce((acc, file) => {
    acc.push(file.replace('.md', ''))
    return acc
  }, [] as string[])

export const preloadHtmlList = fileNames.map((fileName) => ({
  rel,
  href: `${baseURL}/${targetArticles}/${fileName}`,
}))
