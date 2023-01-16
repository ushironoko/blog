---
title: generateフックでブログにツイートを埋め込む
description:
publishedAt: 2022-05-24
---

ブログにツイートを自動で埋め込みできるようにした。markdown の中にツイートへの直リンクがある場合、以下のように表示される。

https://twitter.com/ushiro_noko/status/123772055698153472

通常の埋め込みツイートと少し違うが後述する API を用いていることが理由。

## 実装

[tweetic.io](https://www.tweetic.io/) というツイートを静的な HTML に変換して返してくれる API をつかった。HTML 文字列の他にツイートURLなど以下の形式の付属情報も返してくれる。

```ts
{
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
```

`yarn generate` 時のフックに以下のような処理を書くことで、レンダリング前の HTML に API から返却された HTML を差し込む形で実装した。

ざっくり言えば `yarn generate` 時に html に含まれるツイートへの直リンクを正規表現で取得して、tweetic.io の API を Promise.all する。帰ってきた HTML を `page.html` に対して順番に差し込んでいくようにしている。


nuxt.config.ts

```ts
generate: {
  page: async (page: { route: any; path: any; html: string }) => {
    const matchers = /"https:\/\/twitter.com\/.+?\/status\/[0-9]+?"/gi
    const matchedUrls = page.html.match(matchers)
    if (!matchedUrls) return

    const targetUrls = matchedUrls.map((url) => url.replace(/"/g, ''))

    if (!targetUrls.length) return

    await Promise.all(
      targetUrls.map(async (url) => {
        return await axios.get<TweeticResponse>(
          'https://www.tweetic.io/api/tweet',
          {
            params: {
              layout: '',
              url,
              css: '',
              enable_twemoji: true,
              show_media: true,
              show_quoted_tweet: true,
              show_info: true,
            } as TweeticParams,
          }
        )
      })
    )
      .then((res) => {
        const dom = new JSDOM(page.html)
        const aTags = dom.window.document.querySelectorAll('a')
        const replaceList: { target: string; staticHtml: string }[] = []

        aTags.forEach((aTag) => {
          if (aTag.parentElement?.tagName === 'P') {
            res.forEach(({ data }) => {
              const {
                html: staticHtml,
                meta: { url },
              } = data

              if (aTag.parentElement && aTag.href === url) {
                replaceList.push({
                  target: aTag.parentElement.outerHTML,
                  staticHtml: `${staticHtml}<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`,
                })
              }
            })
          }
        })

        page.html = replaceList.reduce((acc, { target, staticHtml }) => {
          return acc.replace(target, staticHtml)
        }, dom.serialize())
      })
      .catch((err) => {
        consola.error(err)
      })
  },
},
```

なぜこうしたかというと API を使ってみたかったから以外ない。普通のツイート埋め込みに比べてツイートに対するアクションができなかったり、スレッドを作れなかったり、動画が再生できなかったりして不便ではある。また generate フックでやっているので `yarn dev` 中には結果を見ることができない。

- 本当はスレッドと画像が表示される

https://twitter.com/miyaoka/status/1346664808402206721


- 本当はメディアが再生できる

https://twitter.com/miyaoka/status/1346853138259611648

またビルドするごとに API コールするためエコではない。Nuxt 3に移行して ISR できるようになればこの問題は解決するが、その他の不便さは API が頑張ってくれるしかない気もしている。

## 没案

当初は hast や rehype プラグインを使って ast からごにょごにょしようとしていたが、やっていくうちに DOM API が使いたくなり、hast to DOM をしてみたが jsdom で良い感が強くこのやり方に落ち着いた。

また miyaoka.dev　や zenn.dev のように WebComponents で実装することもできた（このブログもjsを全部抜いている）が、二番煎じは面白くないので没にした。

https://miyaoka.dev/posts/2021-01-07-tweet-component

## 追記

2022/07
tweeticio のアップデートでメディア表示ができるようになっていた。リクエストパラメータでフラグを付与すればおｋ。
