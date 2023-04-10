import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkExternalLinks from 'remark-external-links';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'posts');

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fullPath = path.join(postsDirectory, `${query.id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(html)
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id: query.id,
    contentHtml,
    ...matterResult.data,
  } as {
    id: typeof query.id;
    contentHtml: typeof contentHtml;
    title: string;
    description: string;
    publishedAt: string;
  };
});
