---
title: ダークモードに対応した
description: tailwind便利案件
publishedAt: 2021-05-19
---

ブログをダークモードに対応させた。Tailwind CSS を使っていればすぐにできるので前々からやりたいとは思っていた。tailwind.config.js の置き場所を間違えていたせいでカスタマイズが全然できていなかったのが解消されたため、これを期にと言う感じ。やったのは以下のものだけ。

- tailwind.config.js に darkMode: 'media' を追加

```js
module.exports = {
  purge: {
    content: ['content/**/*.md'],
  },
  darkMode: 'media',
}
```

- layouts でダークモード時の背景色＆文字色を指定

```vue
<template>
  <div class="dark:bg-black dark:text-white">
    <div class="max-w-screen-sm px-4 py-4 mx-auto text-base leading-loose">
      <TheHeader />
      <main>
        <Nuxt />
      </main>
    </div>
  </div>
</template>
```

- 本文中の blockquote と a タグの色を修正
  - depp セレクタで指定しないと content 内の要素にスタイルが当たらない
  - `@apply` を使っているが DOM 構造を縛らないので許容としている（本来要素そのものにスタイルを当てるべきではない）
  - twitter シェア用のボタンカラーを `dark:` で対応させるために currentColor を指定

```vue
<style lang="postcss" scoped>
::v-deep blockquote {
  @apply p-2;
  @apply italic;
  @apply border-l-4;
  @apply bg-gray-100 dark:bg-gray-900;
  @apply text-gray-600 dark:text-gray-200;
  @apply border-gray-500 dark:border-gray-800;
}

::v-deep a {
  @apply text-blue-800;
  @apply dark:text-blue-400;
  @apply underline;
}

::v-deep a:visited {
  @apply text-purple-900;
  @apply dark:text-purple-400;
}

svg {
  fill: currentColor;
}
</style>
```

- コードブロックが白基調でまぶしかったため prismjs のテーマを config で変更

```js
  content: {
    markdown: {
      rehypePlugins: [
        'rehype-plugin-image-native-lazy-loading',
        [
          'rehype-plugin-auto-resolve-layout-shift',
          { type: 'maxWidth', maxWidth: 640 },
        ],
      ],
      prism: {
        theme: 'prism-themes/themes/prism-material-dark.css',
      },
    },
  },
```

- その他諸々のスタイル調整
  - header と description
  - body に対しても効くように config で`head.bodyAttrs.class`に色指定

色味は暫定なので目が痛いとかあればフィードバックください。
