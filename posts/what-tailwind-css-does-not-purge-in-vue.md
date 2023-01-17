---
title: VueにおいてTailwindCSSは何をパージしないか
description: Tailwindしぐさ
publishedAt: 2021-03-02
---

Tailwind CSS というのがある。

https://tailwindcss.com/

これはプロダクション向けのビルド時に使われていないユーティリティクラスを生成しない機能を持っている。パージ対象を探す処理は以下のような正規表現で行われているらしい。

```shell
/[^<>"'`\s]*[^<>"'`\s:]/g
```

https://tailwindcss.com/docs/optimizing-for-production

ドキュメント通りに読み解くと、ビルド実行前にこの正規表現にかからなかったユーティリティクラスは使われていないと判断されパージされてしまうのではないかと不安になった。しかし、以下のような例でもユーティリティクラスはパージされず動作していた。

```vue
<template>
  <p :class="color">not purge</p>
</template>

<script setup>
const color = 'text-green-500';
</script>
```

上記の例から察するに、Vue では js 実行後のテンプレートに対して正規表現がかけられているのだろうと思った。しかし、実際はもっと雑な（公式表現を借りるとナイーブな）実装になっているようだ。

```vue
<template>
  <p class="text-red-500">パージされない</p>
  <span>text-blue-500</span> ←パージされない
</template>
<script setup>
const color = 'text-green-500'; // パージされない
</script>
```

つまり、tailwind は SFC ファイル全体を見てユーティリティクラスに完全一致する文字列が存在すれば、そのクラスをパージしない。処理自体は間違いなく js 実行前に行われているので以下の例では検知できずにパージされる。

```vue
<template>
  <p :class="`text-${color}-500`">そのクラス、消えるよ</p>
</template>
<script setup>
const color = 'green';
</script>
```

大体手段として windicss を使うというのを考えた。

https://github.com/windicss/vue-windicss-preprocess

こちらであればオンデマンドで常に必要なユーティリティクラスしか生成しないため動的なクラス名の組み立てでも問題なく、設定ファイルのパージ対象の記述も消せると考えた。Vue では vue-loader 上で動作する。

しかし、windicss の場合も scirpt ブロック側で定義しテンプレートで参照していないユーティリティクラスはパージ対象にならないようだった。

```vue
<template>
  <p class="text-red-500">not purge</p>
</template>

<script setup>
const color = 'text-green-500';
</script>
```

![パージされずにクラスが生成されていることがわかる写真](https://i.gyazo.com/f176906777f304f2ce251f7bf939beed.png)

また動的に文字列を組み立てた場合は検知できずパージされてしまっていた（開発モード）。

tailwind をそのまま使った方

```vue
<template>
  <p :class="`text-green-${colorNumber}`">not purge</p>
</template>

<script setup>
const colorNumber = '500';
</script>
```

windicss

```vue
<template>
  <p :class="`text-green-${colorNumber}`">purged</p>
</template>

<script setup>
const colorNumber = '500';
</script>
```

![tailwindそのままとwindicssの場合の結果を比較した写真](https://i.gyazo.com/6a4d09bb197cf3b00b8dde674d335ea1.png)

tailwind をそのまま使った方も、プロダクションビルド時にはパージされる。パージされるのが早いか遅いかくらいの違いしかなかった。windicss のパージ処理を深く追っていないので詳細は分からないが、vue-loader 上で SFC ファイル内を正規表現にかけるみたいなことをやっているだけかもしれない。

## 結論

- SFC ファイル内でユーティリティクラスに完全一致する文字列があったらそれはパージしない
- 文字列組み立てされていると検知できずにパージされる
- windicss のような Purge CSS に依存していないライブラリでも同じ挙動になるっぽい
