import { TweeticParams, TweeticResponse } from '~~/src/types/tweeticio';
import JSDOM from 'jsdom';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { $fetch } from 'ofetch';
import consola from 'consola';

const postsDirectory = path.join(process.cwd(), '.output', 'public', 'posts');

async function replaceTweetURL() {
  try {
    const indexHtmls = await glob(`${postsDirectory}/**/index.html`, {});

    await Promise.all(
      indexHtmls.map(async (indexHtml) => {
        const html = fs.readFileSync(indexHtml, 'utf8');
        const matchers = /https:\/\/twitter.com\/.+\/status\/[0-9]+/gi;
        const matchedUrls = html.match(matchers);

        if (!matchedUrls) return;

        const targetUrls = matchedUrls.map((url) => url.replace(/"/g, ''));

        if (!targetUrls.length) return;

        await Promise.all(
          targetUrls.map(async (url) => {
            return await $fetch<TweeticResponse>(
              'https://tweetic.io/api/tweet',
              {
                params: {
                  layout: '',
                  url,
                } as TweeticParams,
              }
            );
          })
        )
          .then((res) => {
            const dom = new JSDOM.JSDOM(html);
            const pTags = dom.window.document.querySelectorAll('p');
            const replace = (pTag: HTMLParagraphElement) => {
              const isMatche = targetUrls.some((url) =>
                pTag.textContent?.startsWith(url)
              );

              if (!isMatche) return;

              // twitter urlを正規かする
              const tweet = res.find((r) => {
                return r.meta.url === pTag.textContent;
              });
              if (!tweet) return;
              pTag.outerHTML = tweet.html;
            };
            pTags.forEach(replace);
            fs.writeFileSync(indexHtml, dom.serialize());
          })
          .catch((e) => {
            consola.error(e);
          });
      })
    );
  } catch (e) {
    consola.error(e);
  }
}

export default async function main() {
  await replaceTweetURL();
}
