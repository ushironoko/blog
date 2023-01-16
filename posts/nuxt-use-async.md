---
title: useAsync がレンダリングブロックしてくれない件の調査ログ
description: Nuxt3で直るそうです
publishedAt: 2021-09-08
---

Nuxt の `useAsync` の調査ログ。そもそも `asyncData` がなぜレンダリングを待つことができるのかも気になったので調べてみた。

## Nuxt 本体 の asyncData

ポイントは client.js の `render` と `mountApp`

`mountApp`
https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L843-L958

`render`
https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L291-L606

`render` の内部では、vue-router から受け取ったパスに登録されたコンポーネント（つまり page コンポーネント）のオプションに `asyncData` がある場合、マウントする前にそれを呼び出す。

https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L506-L532

呼び出した結果は utils.js 内の `applyAsyncData` に渡され、data プロパティとマージされる。

https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/utils.js#L71-L97

`applyAsyncData` は内部に `this.$ssrContext.asyncData` を参照している箇所があるが、これはサーバーサイドで `asyncData` が呼ばれていた場合にその値をクライアント側にマージするための処理で、`this.$ssrContext` はサーバー側で server.js が呼び出された際に設定される Nuxt のコンテキスト。サーバーでの `asyncData` の呼び出し時にも `applyAsyncData` が使われていて、コンテキストに入れられる。

https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/server.js#L308-L338

`render` は mountApp の内部で最後に呼び出されている。
mountApp では、後述する `createApp` から受け取ったエントリーポイントオブジェクトと vue-router のルート設定を含むオブジェクトを受け取り実行され、受け取ったエントリーポイントで `new Vue(app)` する。

その後、`render` が実行される前に一度 `resolveComponents` を呼び出している。

https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L901

`resolveComponents` はカリー化されており、`flatMapComponents` という関数を返す。Promise.all は引数にカリー化された関数を渡すと順に実行してくれる（カリー化された関数は iterable）。

`flatMapComponents` は引数に vue-router の route オブジェクトと関数を受け取り、その route に定義されているコンポーネント一覧を配列で返却する。また内部では第二引数に渡した関数を用いて、コンポーネントから取り出したオプションを引数としてもらいながらすべて実行される。

`flatMapComponents` の実体
https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/utils.js#L131-L142

呼び出し箇所
https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L232-L244

第二引数に渡している関数は最終的に `applyAsyncData` へコンポーネントを渡す。`render` 内部の処理と違うのは、この時サーバー側で `asyncData` が呼ばれていた時にはその値をマージする処理を実行すること。つまり、この時の `resolveComponents` の呼び出しはサーバーで解決された値をマージするためのものと考えられる（`applyAsyncData` を CSR 用と SSR の値マージ用で2回呼ばないといけない）。

この処理の後、`render` 関数が実行され、コンポーネントの `asyncData` が CSR として実行され、その後に mount 関数が発火してマウントされる。このように `asyncData` を用いたクライアントレンダリングの場合も、データの取得が終わるまでマウントが開始されず、レンダリングブロックという形になる。

そもそも `mountApp` が受け取る `__app` には何が入っているかというと、index.js から返されるエントリーポイントオブジェクトと vue-router のルート定義。`createApp` 関数は Nuxt に渡された plugin や store、router、meta などの設定を Vue へ登録後、`App.js` というエントリーポイントの元となるコンポーネントに必要な定義をマージしたオブジェクトと、解決済みのルートオブジェクトを返すようになっている。

`createApp` 呼び出し箇所
https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L122

`createApp` の実体
https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/index.js#L94-L304

`App.js` の実体
https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/App.js#L41-L347

ちなみに `asyncData` が解決されると nuxt.loading が 45% 進む。

https://github.com/nuxt/nuxt.js/blob/6f94b1f9d7205b5de9215bdc16b7a9f67a61a0c6/packages/vue-app/template/client.js#L503
https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/components/nuxt-loading.vue#L59-L62

### 要約

Nuxt は Nuxt に設定された定義を Vue に登録してインスタンスを作り、ページルーティングが確定した後ページコンポーネントの asyncData をコール、その際サーバー側でも呼び出されていた場合は context から値を取り出してマージし、マウントされる。


## @nuxtjs/composition-api の useAsync

composition api 版の方では、純粋に SSR 時には `onServerPrefetch` が呼び出され、CSR 時は普通にコールされる。

https://github.com/nuxt-community/composition-api/blob/4c8d8c54984e2f6cf44ce459f8e3b9a8fca58485/src/runtime/composables/async.ts#L48-L56

`onServerPrefetch` は内部で `vue-server-renderer` を使っていて、Promise の解決までレンダリングを止めることができる。

https://github.com/vuejs/composition-api/blob/main/test/ssr/serverPrefetch.spec.js#L20-L41

CSR ではこれが使われていないため、`setup` の実行がそのまま終了して return、マウント後に `useAsync` が解決して値が入るという流れになっている（と思う）。`setup` の実行タイミング次第で待つことができるようになるかもしれないが、Vue2 系では無理だったという issue もあるため詳細は分からない。

https://github.com/nuxt-community/composition-api/issues/329#issuecomment-748243436
