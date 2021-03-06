---
title: ブログを作りました
description: 初投稿です
publishedAt: 2020-12-23
---

こんばんは、うしろのこです。
`@nuxt/content` モジュールを使ったブログを作ってみました。ここ最近本当になにか作るということをしておらず、2.10以降増えたNuxtのAPI周りすら把握していなかったのでこれはいかんと思い、友人が絶賛していたcontentモジュールを使って簡単なブログを作ってみました。

技術スタックこんな感じ
- フレームワーク: [Nuxt.js](https://ja.nuxtjs.org/) + [@nuxtjs/composition-api](https://github.com/nuxt-community/composition-api)
- CMS: [@nuxt/content](https://content.nuxtjs.org/)
- Host: [vercel](https://vercel.com/)
- Styling: [Tailwindcss](https://tailwindcss.com/)

vercelは一度使ってみたかった。リポジトリ連携からデプロイまでが大体5分程度でとても簡単なのが特徴です。vercel内でドメインをとったりリポジトリをみたりlighthouseやslackのインテグレーションをぽちぽちでやったりととにかく作業が完結できます。

ロジックはほぼ全てComposition APIで記述しています（そんなに複雑ではないですが）。最近業務でもNuxtプロダクトへComposition APIをいい感じに入れていくみたいなことがメインになりつつあるので、公私関係なくVue3に寄せていく感じになりそうです。

ぶっちゃけスタイル周りが一番苦戦した（tailwindcss module初めて使った）。有識者の知見がほしいところ。

はてブの方はどうするか悩みますが、日常系と技術系をわけてもいいかもしれませんね。こっちの方が書きやすいのでこっちを日常にするかもしれませんが…。

[うしろのこの本ください](https://ushirock.hateblo.jp/)

## 仕事・近況

仕事では自身の希望もありアプリケーション開発チームから基盤改善チームという部署に移動になって、今はそっちで Nuxt プロダクトの長期的な最適化をしています。Tree Shaking の対応やポリフィルなどの最適化、mixins や Vuex の composition api 化、それに伴うテストの見直しなどプロダクト設計を総合的に見直して整地していく作業です。独りよがりでこういうのをやっていると確実に孤立するし、新しい技術は導入前にしっかりチームへ還元していくべきです。日々ドキュメンテーションや勉強会などに追われています（予定）。とても重要な仕事ですね。通常の開発から離れるのは若干寂しいですが、どっちかというと開発基盤を作ってメンバーに気持ちよく開発してもらえるほうが好きなのでしばらくこの路線でやっていきます。

また、テックブログ管理室というのにも参加しています。元々採用によるブランディングに強い興味があって、入社前からもし関われるのならという話はしていました。現在絶賛アドベントカレンダーの運営中なのでよければどうぞ。

https://tech.hey.jp/entry/2020/12/01/172331

他にも刺激的なプロジェクトに参加させてもらってますが、公開できるようになったら書こうと思います。0 → 1に近い領域から改善まで広く経験できる開発者にやさしい環境です。オーバーワークにならないように気をつけます。

プライベートですが引越ししました。リモートということもあってもっと広いところ、かつ利便性の高い地域へ移住しました。場所や詳細は追々書くかもしれません。インターネットを引くのに少々トラブって1ヶ月近くテザリング生活していました。なんとかギガモンスタープランみたいなやつで、月々に余ったギガ分を翌月に繰り越せるタイプです。80GB以上あったギガが一桁になるくらい弱っていました。仕事ってすごい。みなさんは間違ってもテザリングでnpm iとかyarnとかdocker pullとかbundle installとかしないようにしましょう。(4敗)
