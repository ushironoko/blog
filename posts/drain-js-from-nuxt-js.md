---
title: NuxtのJS全部抜く
description: 生成しないとは言ってない
publishedAt: 2021-04-27
---

※Nuxtに標準で含まれる機能を用いてランタイムを抜くことができたため、本文の最後に追記しています。

前に STUDIO の miyaoka さんがブログでこういうことをやっていた。

> しかしこのブログはドキュメントでありアプリケーションではないので、ほぼ JS を動かす必要はない。state は不要だし、client-side routing も要らない（先読みに必要かもだが）。なのでピュアに HTML として書き出したい。

[Next の JS ぜんぶ抜く](https://miyaoka.dev/posts/2021-01-15-drain-js-from-nextjs)

確かにうちのブログも今の状態だと一度生成したら nuxt-link による prefetch 以外では js が不要で、プレーンな html のロードなら prefetch しなくても十分速いし js 抜くかという気持ちになった。

## Nuxt にはそういう機能はない

先のブログでも使われている通り、Next には生成時にランタイムを消すオプションがあるらしい。しかし軽く調べた感じ Nuxt にはそういった機能や issue は見当たらなかった。ということで自前でなんとかするしかないが、Nuxt には hooks というビルドプロセスへ介入できる素晴らしい機能（React の hooks とは無関係）が備わっているためそう難しい話でもない。

[hooks プロパティ](https://ja.nuxtjs.org/docs/2.x/configuration-glossary/configuration-hooks/)

hooks にはライフサイクルフックやサーバーモードで使用した時のインスタンスに対するものもある。今回使うのは `generate` の `page` フックで、ページ生成後の html ファイルに対して任意の処理を書ける。これでスクリプトタグと preload 用の link タグを消してしまえば実質 JS 全部抜くである。処理は nuxt.config.js に書く。

```js
hooks: {
  'content:file:beforeInsert': (document) => {
    if (document.extension === '.md') {
      let wordCount = 0
      const { text } = readingTime(document.text, {
        wordsPerMinute: 1000,
        wordBound: (_) => {
          if (wordCount === 2) {
            wordCount = 0
            return true
          } else {
            wordCount++
            return false
          }
        },
      })
      document.reading_time = text
    }
  },
  generate: {
    page: (page) => {
      const scriptTag = /<script[^>]+?\/>|<script(.|\s)*?\/script>/gi
      const linkTag = /<link[^>]+? as="script">/gi
      const tmp = page.html.toString().replace(scriptTag, '')
      page.html = tmp.toString().replace(linkTag, '')
    },
  },
},
```

元々読了時間を埋め込む用の hook を書いていたためその下に追記した。正規表現で `<script></script>` と `<link as="script">` を空文字に置換している。以下がこのブログの最初の投稿の出力結果になる。

```html
<!doctype html>
<html data-n-head-ssr lang="ja" data-n-head="%7B%22lang%22:%7B%22ssr%22:%22ja%22%7D%7D">
  <head>
    <title>ブログを作りました - ushironoko.me</title><meta data-n-head="ssr" charset="utf-8"><meta data-n-head="ssr" name="viewport" content="width=device-width,initial-scale=1"><meta data-n-head="ssr" data-hid="description" name="description" content="ushironokoのブログです。日常から技術の話までなんでも書きます。"><meta data-n-head="ssr" name="twitter:card" content="summary_large_image"><meta data-n-head="ssr" name="twitter:site" content="@ushirono_noko"><meta data-n-head="ssr" name="twitter:card" content="summary_large_image"><meta data-n-head="ssr" name="twitter:site" content="@ushirono_noko"><meta data-n-head="ssr" property="og:url" content="https://ushironoko.me/articles/2020/first-post"><meta data-n-head="ssr" property="og:title" content="ブログを作りました"><meta data-n-head="ssr" property="og:description" content="初投稿です"><meta data-n-head="ssr" property="og:image" content="https://ushironoko.me/articles/images/ushironoko.jpg"><link data-n-head="ssr" rel="icon" type="image/x-icon" href="/articles/images/ushironoko.jpg"><style data-vue-ssr-id="65fe3271:0 35958ba6:0 e6272bd8:0 d8514df6:0 81ad29dc:0">/*! tailwindcss v2.1.1 | MIT License | https://tailwindcss.com*//*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */*,::after,::before{box-sizing:border-box}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'}hr{height:0;color:inherit}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],button{-webkit-appearance:button}legend{padding:0}progress{vertical-align:baseline}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:transparent;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}fieldset{margin:0;padding:0}ol,ul{list-style:none;margin:0;padding:0}html{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}body{font-family:inherit;line-height:inherit}*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{padding:0;line-height:inherit;color:inherit}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}body{overflow-wrap:break-word;overflow-y:overlay}ul{list-style-type:disc;list-style-position:inside}h1,h2{font-weight:500}h1,h2{font-size:1.5rem;line-height:2rem}h3{font-weight:500;font-size:1.125rem;line-height:1.75rem}h4{font-weight:500;font-size:1rem;line-height:1.5rem}main h2{font-size:1.25rem;line-height:1.75rem}a{text-decoration:none;color:inherit}blockquote{padding:.5rem;font-style:italic;border-left-width:4px;--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity));--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}.nuxt-content a{color:#00e}.nuxt-content a:visited{color:#551a8b}.nuxt-content{white-space:pre-line}.nuxt-content ul{white-space:normal}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.flex{display:flex}.table{display:table}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}.font-light{font-weight:300}.font-extrabold{font-weight:800}.text-2xl{font-size:1.5rem;line-height:2rem}.leading-loose{line-height:2}.my-6{margin-top:1.5rem;margin-bottom:1.5rem}.my-12{margin-top:3rem;margin-bottom:3rem}.mx-auto{margin-left:auto;margin-right:auto}.mr-2{margin-right:.5rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-screen-sm{max-width:640px}.py-4{padding-top:1rem;padding-bottom:1rem}.px-4{padding-left:1rem;padding-right:1rem}.static{position:static}*{--tw-shadow:0 0 #0000}*{--tw-ring-inset:var(--tw-empty, );/*!*//*!*/--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59, 130, 246, 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000}.text-black{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}.no-underline{text-decoration:none}.hover\:no-underline:hover{text-decoration:none}.w-full{width:100%}@-webkit-keyframes spin{to{transform:rotate(360deg)}}@keyframes spin{to{transform:rotate(360deg)}}@-webkit-keyframes ping{100%,75%{transform:scale(2);opacity:0}}@keyframes ping{100%,75%{transform:scale(2);opacity:0}}@-webkit-keyframes pulse{50%{opacity:.5}}@keyframes pulse{50%{opacity:.5}}@-webkit-keyframes bounce{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}@keyframes bounce{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.token.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#dd4a68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.nuxt-progress{position:fixed;top:0;left:0;right:0;height:2px;width:0;opacity:1;transition:width .1s,opacity .4s;background-color:#000;z-index:999999}.nuxt-progress.nuxt-progress-notransition{transition:none}.nuxt-progress-failed{background-color:red}.container[data-v-2cc14f0e]{font-size:1rem;line-height:1.5rem;line-height:2;margin-left:auto;margin-right:auto;max-width:640px;padding-top:1rem;padding-bottom:1rem;padding-left:1rem;padding-right:1rem}.description[data-v-4b4bc854]{font-size:.875rem;line-height:1.25rem;--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity));margin-bottom:2rem}</style>
  </head>
  <body>
    <div data-server-rendered="true" id="__nuxt"><!----><div id="__layout"><div data-v-2cc14f0e><div class="container" data-v-2cc14f0e><header class="flex items-center justify-between w-full my-6 font-mono" data-v-2cc14f0e><a href="/" class="no-underline hover:no-underline"><p class="text-2xl font-extrabold text-black">ushironoko.me</p></a> <div><a target="_blunk" rel="noopener" href="https://twitter.com/ushiro_noko">Twitter</a> <a target="_blunk" rel="noopener" href="https://ushironoko.me/feed.xml" class="mr-2">RSS</a></div></header> <main class="font-light" data-v-2cc14f0e><article data-v-2cc14f0e><h1>ブログを作りました</h1> <div class="description" data-v-4b4bc854><p data-v-4b4bc854>
    2020/12/23
    / ⏳ 2 min read
  </p> <!----></div> <div class="nuxt-content"><p>こんばんは、うしろのこです。
<code>@nuxt/content</code> モジュールを使ったブログを作ってみました。ここ最近本当になにか作るということをしておらず、2.10以降増えたNuxtのAPI周りすら把握していなかったのでこれはいかんと思い、友人が絶賛していたcontentモジュールを使って簡単なブログを作ってみました。</p>
<p>技術スタックこんな感じ</p>
<ul>
<li>フレームワーク: <a href="https://ja.nuxtjs.org/" rel="nofollow noopener noreferrer" target="_blank">Nuxt.js</a> + <a href="https://github.com/nuxt-community/composition-api" rel="nofollow noopener noreferrer" target="_blank">@nuxtjs/composition-api</a></li>
<li>CMS: <a href="https://content.nuxtjs.org/" rel="nofollow noopener noreferrer" target="_blank">@nuxt/content</a></li>
<li>Host: <a href="https://vercel.com/" rel="nofollow noopener noreferrer" target="_blank">vercel</a></li>
<li>Styling: <a href="https://tailwindcss.com/" rel="nofollow noopener noreferrer" target="_blank">Tailwindcss</a></li>
</ul>
<p>vercelは一度使ってみたかった。リポジトリ連携からデプロイまでが大体5分程度でとても簡単なのが特徴です。vercel内でドメインをとったりリポジトリをみたりlighthouseやslackのインテグレーションをぽちぽちでやったりととにかく作業が完結できます。</p>
<p>ロジックはほぼ全てComposition APIで記述しています（そんなに複雑ではないですが）。最近業務でもNuxtプロダクトへComposition APIをいい感じに入れていくみたいなことがメインになりつつあるので、公私関係なくVue3に寄せていく感じになりそうです。</p>
<p>ぶっちゃけスタイル周りが一番苦戦した（tailwindcss module初めて使った）。有識者の知見がほしいところ。</p>
<p>はてブの方はどうするか悩みますが、日常系と技術系をわけてもいいかもしれませんね。こっちの方が書きやすいのでこっちを日常にするかもしれませんが…。</p>
<p><a href="https://ushirock.hateblo.jp/" rel="nofollow noopener noreferrer" target="_blank">うしろのこの本ください</a></p>
<h2 id="仕事・近況"><a href="#%E4%BB%95%E4%BA%8B%E3%83%BB%E8%BF%91%E6%B3%81" aria-hidden="true" tabindex="-1"><span class="icon icon-link"></span></a>仕事・近況</h2>
<p>仕事では自身の希望もありアプリケーション開発チームから基盤改善チームという部署に移動になって、今はそっちで Nuxt プロダクトの長期的な最適化をしています。Tree Shaking の対応やポリフィルなどの最適化、mixins や Vuex の composition api 化、それに伴うテストの見直しなどプロダクト設計を総合的に見直して整地していく作業です。独りよがりでこういうのをやっていると確実に孤立するし、新しい技術は導入前にしっかりチームへ還元していくべきです。日々ドキュメンテーションや勉強会などに追われています（予定）。とても重要な仕事ですね。通常の開発から離れるのは若干寂しいですが、どっちかというと開発基盤を作ってメンバーに気持ちよく開発してもらえるほうが好きなのでしばらくこの路線でやっていきます。</p>
<p>また、テックブログ管理室というのにも参加しています。元々採用によるブランディングに強い興味があって、入社前からもし関われるのならという話はしていました。現在絶賛アドベントカレンダーの運営中なのでよければどうぞ。</p>
<p><a href="https://tech.hey.jp/entry/2020/12/01/172331" rel="nofollow noopener noreferrer" target="_blank">https://tech.hey.jp/entry/2020/12/01/172331</a></p>
<p>他にも刺激的なプロジェクトに参加させてもらってますが、公開できるようになったら書こうと思います。0 → 1に近い領域から改善まで広く経験できる開発者にやさしい環境です。オーバーワークにならないように気をつけます。</p>
<p>プライベートですが引越ししました。リモートということもあってもっと広いところ、かつ利便性の高い地域へ移住しました。場所や詳細は追々書くかもしれません。インターネットを引くのに少々トラブって1ヶ月近くテザリング生活していました。なんとかギガモンスタープランみたいなやつで、月々に余ったギガ分を翌月に繰り越せるタイプです。80GB以上あったギガが一桁になるくらい弱っていました。仕事ってすごい。みなさんは間違ってもテザリングでnpm iとかyarnとかdocker pullとかbundle installとかしないようにしましょう。(4敗)</p></div> <div class="flex justify-center my-12"><a href="https://twitter.com/intent/tweet?text=ブログを作りました%0ahttps://ushironoko.me/articles/2020/first-post" target="_blank" rel="noopener"><img width="24px" height="24px" src="/Twitter_Social_Icon_Circle_White.svg" alt class="text-gray-900"></a></div></article></main></div></div></div></div>
  </body>
</html>
```

![devtoolのネットワークタブでjsが読み込まれていないことを確認している写真](https://i.gyazo.com/8e9beb831c96037a5c3924e9308951ab.png)

実際にはビルド時に js は生成されているため Next みたくランタイムを出力結果から消すわけではないが、html が読み込まないのでセーフ。実は `nuxt/content` で composition api を使った時に全てのページで `db.json` という検索クエリ発行時に参照するためのデータを読んでしまっており、json には全ページ分のデータが入っていて記事が増えるたびに重くなるという悩みがあった（本来 asyncData と fetch の外でクエリが呼ばれた時にしか参照しない）。今回の改善でついでに解消されてかなり早くなった。

## 追記

設定あるって教えてもらった（がっつりドキュメントに書いてある）。

https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-render/#injectscripts

```js
  render: {
    injectScripts: false,
  },
```

とするだけでjsを読み込まないプレーンなHTMLを生成してくれる。ただし、自前で消していた時と同じようにランタイム自体は生成されるっぽい。

![distの中身のスクリーンショット](https://i.gyazo.com/08851ad1147edda4727e05ef9f1e09cb.png)

injectScriptsがfalseの場合、preload用のlinkタグとランタイム読み込み用のscriptタグの差し込みをスキップするようになってるっぽい。

https://github.com/nuxt/nuxt.js/blob/07e97f168ab02a49d84db7c2279432677446d1eb/packages/vue-renderer/src/renderers/ssr.js#L180-L240
