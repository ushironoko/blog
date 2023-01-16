---
title: Nuxt3 rfc ぜんぶ読む
description: Nuxt3 rfc ぜんぶ読む
publishedAt: 2021-11-12
---

Nuxt3 のリポジトリが公開され、ディスカッションに記載されている rfc を読むことができるようになった。

https://github.com/nuxt/framework/discussions/categories/rfcs

せっかくだし全部読んでみる。

## [Route Caching rules (Hybrid) ](https://github.com/nuxt/framework/discussions/560)

表題の通りルートに関する rfs。要約すると、ルートごとに CSR や SSR などコンテンツの取り扱いを決められるようにするというもの。

```ts
export default defineNuxtConfig({
  routes: {
    '/': { prerender: true }, // Once per build (via builder)
    '/blog/*': { static: true }, // Once on-demand per build (via lambda)
    '/stats/*': { swr: '10 min' }, // Once on-demand each 10 minutes (via lambda)
    '/admin/*': { ssr: false }, // Client-Side rendered
    '/react/*': { redirect: '/vue' }, // Redirect Rules
  }
})
```

Nuxt 2では `ssr` プロパティ（旧 `mode` プロパティ）によってアプリケーションを CSR にするか SSR にするか、また `target` プロパティにて Static（SG）にするかを選択できたが、ページ単位での設定はサポートされていなかった。

この rfc では CSR/SSR/SG 以外に SWR や リダイレクトの設定等も `routes` プロパティ内で出来るようになるとなっている。また、互換性維持やシンプルな設定手法として旧 API も引き続き使えるようになっている。

### 所感

この機能は Nuxt の中でも要望の多かった方で、Nuxt Nation 中のコメント欄でも ISR に次いで言及されていた（気がする）。個人的にもこの用途で Next に移行する事例を見かけていてもったいないと思ったりしていたため、サポートされるのは純粋に良いことだと思う。

一方でページごとに CSR/SSR/SSG を切り替えたいというのは扱うコンテンツの性質によって温度感が違うし、運用面でも混在していると特有の困りなどが発生しそうという印象。まあできないよりはできた方が良いよなって感じ。言及されているが、プラットフォーマーによって取り回される領域なのでそこのサポートも必要。

レンダリング手法の切り替えだけでなく、swr （キャッシュの有効期限とは別にキャッシュを返しても良い時間）の指定が出来る点は便利そうだと思った。リダイレクト設定も従来は middreware で書かれていたものがルートに対して書けるようになりより直感的になった感じがする。

`redirect: false` でリダイレクトしないみたいなことが出来そうだし、柔軟性の面でも middleware に劣るということはなさそう。middleware では context から グローバルな値にアクセスできるというメリットがあり、ルーティングとステートの切り離しという面でもよさそう。

## [Meta SEO and PWA tags](https://github.com/nuxt/framework/discussions/1823)

Nuxt PWA Module には適切な PWA と SEO 管理のための統合的な　meta　タグを設定できるプリセットがあり、昨今の事情を鑑みるとどのようなアプリケーションにもそれらの　meta　タグ設定は重宝されるものとなった。ので、module にある meta タグプロパティのいくつかを本体に移植し、本体の持つユーティリティ合成関数との統合もしようというやつ。

デフォルトでは以下が使える。

- charset (default utf-8)
- viewport (default width=device-width, initial-scale=1 ?)
- name
- description
- author
- lang
- ogSiteName / ogTitle / ogDescription / ogHost (more)

使う時は nuxt.config.js の meta プロパティか ページコンポーネントで `useMeta` を使う（ページコンポネでとは書いてないけどまあそうでしょ）。

```ts
export default defineNuxtConfig({
  meta: {
    charset: 'utf-8'
  }
})
```

```ts
useMeta({
  author: 'Jon Doe'
})
```

または Nuxt3 から利用できるようになった [Meta コンポーネント](https://github.com/nuxt/framework/blob/850ef69a878294bb2854fdfe07d1d8bc71d0d52d/packages/nuxt3/src/meta/runtime/components.ts)を使う。

```vue
<template>
<div>
   <Meta :lang="article.lang" />
</div>
</template>
```

### 所感

いいんじゃないでしょうか（適当）。正直あまり気にしたことなかったので PWA が SEO がという部分にピンときていない（自分が運用したことがないだけ）。あったら便利なんかと考えると便利なんだろうけどそこら辺って手で触らないといけないんでしょうか…みたいな気持ちになった。まあやらなきゃだめなんだろう。

## [Handling unhandled runtime errors](https://github.com/nuxt/framework/discussions/559)

ちょっと難しいが、現状のエラーハンドリング機能では拾いきれないものがあり、それを改善したいという話。特にサーバーとクライアントの両方で実行されるコードは、エラーの扱いが難しい（isomorphicって久しぶりに聞いた）。

また、Nuxt のデフォルトで用意されているエラーページのカスタムの難易度が高めだったり、リアクティブに動作しないなどの問題点も指摘されており、これらを一挙に解決するための統合的なエラーフレームワークが必要とのこと。

具体的にどのようなコードになり扱われるかは書かれていないが、おそらく全ての環境でハンドリングされたエラーは単一の SFC に集約される。

### 所感

ぶっちゃけイメージが湧いていない。ディスカッションが開かれたのも最近なのであったまってきたらまた覗いてみよう。

余談だが Nuxt がデフォルトで持っているページは Nuxt Design というところで管理されているのを知った。
https://github.com/nuxt/design


## [Moving Nitro to standalone bundler](https://github.com/nuxt/framework/discussions/1690)

Nuxt3 では Nitro（ナイトロ、ニトロではない） というサーバーエンジンが採用されており、Node.js API 非依存なコードやモジュールで作られているため、JS が実行できるあらゆる環境で動作する。例えば Nuxt を Service Worker や Deno、Edge Functions で動かすことも可能。

Nuxt が環境を選ばず、どんな環境・プラットフォームでもエッジレンダリングできるフレームワークになった要因でもあるが、この rfc では Nitro にハードコードされている Nuxt の依存周りをプラグインへと切り出し、Nitro 自体は特定のフレームワークに依存しない状態にするというのが言われている。

Nuxt 依存部分に関しては `nitro-plugin-vue` のような Vite でも採用されているプラグイン方式になる。つまり、`nitro-plugin-react` や `nitro-plugin-svelte` などを作ることが技術的に不可能ではなくなる、ということ。

### 所感

一番やって欲しかったことをやってくれそうで嬉しいというのが正直な感想。直近のニュースで Next 12 では Vercel の Edge Fnctions での動作が発表されたが、Nitro はベンダーのロックインも（仕組み的に webpack のロックインも）ないためより環境の選択肢が広がることが期待できる。

さらに Azure や Netlify、Cloudflare Workers などを正式にサポートしていて、ゼロコンフィグ（一部 wrangler の設定などが必要）でデプロイできる点もエッジレンダリング入門者にとって嬉しいポイント。

[Nuxt 3 を Cloudflare Workers で使ってみた](https://zenn.dev/coedo/articles/60c24424f87a32)

特に Vite をバンドラー/開発環境に選択できる点は非常に大きな利点となり得るので、Vite（React）+ Nitro の組み合わせが Next との選択肢になるような未来も見えてきた。

## [Shortcuts to add vue plugins](https://github.com/nuxt/framework/discussions/1175)

Vue 2系と3系の Vue Plugin を透過的に読み込めるようにする機能を追加するというもの。コードを見ると早い。

Nuxt module の中で読み込むこともできる。が、あまり使われなそうではある。

```ts
import { defineNuxtModule, addVuePlugin } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
     addVuePlugin({
       import: 'vue-gtag',
       options: {}
     })
  }
})
```

nuxt.config.js で直接読み込むこともできる。従来では一度 plugins ディレクトリ内で Vue.use する必要があった。

```ts
import { defineNuxtConfig } from 'nuxt3' // or @nuxt/bridge

export default defineNuxtConfig({
  vue: {
    plugins: [
      'vue-gtag'
    ]
  }
})
```

plugins ディレクトリで従来のように読み込む場合 `Vue.use` の代わりにこうなる。nuxt.config.js 側での設定は不要っぽい。

```ts
import { defineNuxtPlugin } from '#app'
import VueGtag from 'vue-gtag'

export default defineNuxtPlugin(() => {
  useVuePlugin(VueGVueGtagtag)
})
```

内部では Vue2 Plugin であれば `Vue.use`、Vue3 Plugin であれば `app.use` が自動で使われるので、プラグインの移行も容易になる。

### 所感

従来の plugins 配下での登録 + nuxt.config.js への登録は若干の煩わしさがあったものの、アプリケーション初期化前に `Vue.use` をするというのが明確だったのでそこまで問題に感じていなかった。

一方で2系から3系へ移植するとなると、グローバル APIの変更がネックになることもありうるため、Nuxt がその部分を吸収するというのは嬉しいポイント。モジュール内でプラグインを使うというのはおそらくモジュール開発者特有の手法なのであまり気にしなくても良さそう。

## [Minimum Node.js version](https://github.com/nuxt/framework/discussions/1234)

Nuxt3 では Node.js の LTS バージョンから外れている場合、ビルドを失敗させたり警告したりするようになった。この仕組みには package.json の `engines.node` フィールドが使われているが、このフィールドを使うことをユーザーに強制するのはベストなことなのか？という疑問が示されている（より良いアイディアはないか）。

また、この LTS のセマンティックバージョンの更新頻度や、Nuxt CLI（nuxi）での厳密なチェックに絞った方が良いのかなどが検討に上がっており、セマンティックバージョンの更新については Nitro がデプロイされうるプラットフォームがサポートする Node.js バージョンを都度確認する必要があり、どうしようという状態。

また Nuxt のバージョンアップと共にこちらのバージョンも更新していくべきか、なども論点として挙がっている。

### 所感

Node.js バージョンアップ作業は虚無寄りなので頻繁にやりたくないけど放置してるといつの間にか LTS ギリギリになるので、Nuxt のメジャーバージョンアップのついでに Node のバージョンアップも促してくれるのは仕組み的には嬉しいかなと思う。

ここで言われている議題に対しての解答は特に持ってないので、議論が進むのを眺めます。


## [Better pick API with `useAsyncData` and `useFetch`](https://github.com/nuxt/framework/discussions/1407)

Nuxt3 の `useAsyncData` や `useFetch` には `pick` というオプションがあり、レスポンスがオブジェクトの場合 pick で渡したキーの配列に該当する部分のみを得られる。

```ts
/**
* レスポンスイメージ
* {
*   name: 'ushironoko',
*   age: 27,
*   info: {
*    blog: 'https://ushironoko.me',
*    social: {
*     twitter: 'https://twitter.com/ushiro_noko',
*     github: 'https://github.com/ushironoko',
*    }
*   }
* }
*
*/

// user: { name: 'ushironoko, age: 27 }
const { data: user } = useFetch('/path/to/data', { pick: ['name', 'age'] })
```

この機能は現状トップレベルのキーしか対応しておらず、上記の例で言えば `info.blog` と `info.social` はピックできない。これを出来るようにしたいというのがこの rfc 。

API の提案としては4つ出ているが、素材を生かした形式が今のところ人気。

```ts
// user: { name: 'ushironoko, age: 27, info: { social: { twitter: 'https://twitter.com/ushiro_noko' } } }
const { data: user } = await useFetch('/path/to/data', {
  pick: [ 'name', 'age', 'info.social.twitter' ]
})
```
### 所感

まだ全然 Nuxt3 を触っていないのでこのオプションの存在もあるという程度でしか認識していなかったが、確かにあると便利そうな機能。複雑な加工や副作用は `transform` でやればいいので好みは分かれそう。また pick 内の型推論がどうなるのか気になるところではある。文字列で指定すると無理そうだけど…。

そもそも useFetch を使う場合 [ohmyfetch](https://github.com/unjs/ohmyfetch) を強制されるという点で、Nuxt3 になっても `@nuxtjs/composition-api` の方の useFetch を使わざるを得ない（interceptor がない）状況は続きそうだし、Nuxt3 useFetch を使う頃にはもっと整っている気もする。

## [Global store support](https://github.com/nuxt/framework/discussions/571)

Composition API の導入で、ユーザーランドでグローバルな状態管理（Vue ライフサイクルによらない共有状態の管理）が容易に行えるようになったが、引き続き SSR や devtools 等のサポートがされたツールは必要とされるケースはある。

v-tokyo#14 でも共有された通り、現状 Nuxt3 でそれらがサポートされたグローバルストアを構築するには [Vuex5](https://github.com/kiaking/vuex-ideas) と [Pinia](https://github.com/posva/pinia) という2つの選択肢があり、この rfc では Nuxt が特定のライブラリを採用するのではなく、どちらも動作するような状態をとることがベストとされている。

また、上記二つとは別にコアが提供するストアサポートも用意し、3つのストアの API を寄せることでユーザーが適宜好きなものを選択できるようにする、とある。

### 所感

Pinia と Vuex5 は非常に似た API になっており、互換性があるとまで言われているためこの部分を Nuxt がサポートするのは筋が良いように思う。従来の Vuex 運用では Flux の文脈が強く、ロジックの肥大化や開発者側の拡大解釈によるカオス化の歴史を辿っていたが、よりシンプルに洗練されたグローバルステートが選べるということになる。

一方で Nuxt2 からの移行に関しては引き続き素直に行きそうもなく、Vuex を主とした運用を行なっていた場合かなり厳しいだろうという印象。Vuex 自体旧 API を使うのであれば4系でと言っているし、コアの提供するストアが Pinia や Vuex5 に寄せられるならマイグレーション先がないに等しい。しばらくは Vuex4 のままこれらの恩恵を受けられない状態が続きそう。

## [Support WebAssembly](https://github.com/nuxt/framework/discussions/692)

Nitro で WASM をサポートするぞ！という rfc。また Webpack や Vite と WASM の統合をサポートすることでゲームチェンジを狙っている。

### 所感

その発想はなかった。ここまでくるとよくわからないが、インラインに展開された WASM バイナリをチャンクに移動して Vite で起動…みたいなことができる雰囲気がある。静観。

## [Selective server-side rendering](https://github.com/nuxt/framework/discussions/666)

もともと Server only componets と呼ばれていたもの。SSR でのみ使われるコンポーネントで、クライアントバンドルからコンポネが削除される。`Foo.server.vue` とすると使える。
方法は検討中。

### 所感

単にサーバーでのみレンダリングされるコンポーネントをクライアントバンドルから消すことができる、というもので React のアレとは別物。仕様がまだ煮詰まってないっぽいので今用途を考えるのは難しそうだけど、Note に書かれている SSR しながらのオンデマンドなコンポーネント更新や、GET クエリ対応などが実現できれば面白そう。

未来寄りなのでこれも期待せずに静観する。

## [Improve DX of adding modules with CLI](https://github.com/nuxt/framework/discussions/569)

よく使われる Nuxt Module を導入する際の DX を向上させたいという rfc 。`create-nuxt-app` を叩いた時に ESLint や Prettier を入れるか？など聞かれるアレ。

現状テンプレートに沿ってぽちぽち選択していく手法が一般的だが、いくつか問題がある。

- プロジェクトのスキャフォールド時間が長くなる
- 初心者は選べと言われても必要か分からない
- テンプレートが不足している場合追加するメンテが必要

package.json をみて自動インストールすることもできるが、これもいくつか問題がある（省略）。現状考えうるベストは nuxi による CLI インストールで色々解決できるのでどう？という内容。

### 所感

スレッドにもあるが `create-nuxt-app` をメンテし続けるのはかなり厳しそうで、叩いてみるとわかるが CSS フレームワークの選択肢がむちゃくちゃ増えていて見ていて辛い（知らない名前を見て調べに行くというのもオツかもしれんが）。

`nuxi` が nuxt.config.js 内にある modules を見て自動で入れてくれるならこんなに楽なことはないだろう。というわけで自分も nuxi 推し。

## [State Controller](https://github.com/nuxt/framework/discussions/730)

今の Nuxt は起動プロセスが複雑化し、内部で何が起こっているか視覚化することが難しい。state machineを作り、プロセスの可視化支援や Nuxt hook 、CLI のサポートなどをしたいらしい。
ディスカッション内で既にいくつかの起動プロセスが可視化されている。

### 所感

よくわからん。

## おわり

個人的に一番注目しているのはやっぱり `Moving Nitro to standalone bundler` で、Nitro という未来志向の技術にとってはその路線が一番実力を出せるだろうと思っている。

rfc の中にはユーザーランドに近いものや何を言ってるのか分からないものまであったが、概ね2系の頃に言われていた課題に対する解答はあった印象。しらんけど。
