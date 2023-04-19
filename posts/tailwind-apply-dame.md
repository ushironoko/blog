---
title: TailwindCSSのapplyは何が悪いなのか
description:
publishedAt: 2023-04-19
---

Tailwind CSS には `@apply` という機能がある。ユーティリティクラスをカスタムクラスの内部に「展開」するというものだ。例えば以下のようにできる。

```css
.custom-class {
  max-height: 350px;
  &:before,
  &:after {
    content: '';
    @apply block sticky left-0 right-0 -mt-2 pb-3;
  }
}
```

これはビルドするとこうなる。

```css
.custom-class {
  max-height: 350px;
}
.custon-class:before,
.custon-class:after {
  content: '';
  position: -webkit-sticky;
  position: sticky;
  left: 0px;
  right: 0px;
  margin-top: -16px;
  display: block;
  padding-bottom: 24px;
}
```

一方で、作者の Adam 氏は `@apply` を使うことは辞めるように強く提言している。ドキュメントにもまた、「見た目を整理するためだけに使わないように」という章があったりする。

とてもわかりやすい例が 2 つある。ユーティリティクラスの予測できない拡張と、バンドルサイズへの影響だ。これら 2 つについて簡単に触れる。

## @apply はユーティリティクラスの機能を予測できなくする

説明に良い issue があるのでこれを例にする。

[https://github.com/tailwindlabs/tailwindcss/discussions/7975](https://github.com/tailwindlabs/tailwindcss/discussions/7975)

例えばこういうスタイル定義があるとする。

```html
<style>
  .toolbar + .section.border-t {
    margin: 0;
  }
  .custom-class {
    @apply border-t bg-black;
  }
</style>

<div class="toolbar">...</div>
<div class="section custom-class">...</div>
```

これの出力結果はこうなる。

```html
<style>
  .toolbar + .section.border-t {
    margin: 0;
  }
  .toolbar + .section.custom-class {
    margin: 0;
  }
  .custom-class {
    border-top: 1px;
    background-color: #000;
  }
</style>

<div class="toolbar">...</div>
<div class="section custom-class">...</div>
```

元の定義にない `.toolbar + .section.custom-class` が増えている。なぜか。

### border-t というユーティリティの拡張

上記の定義は `border-t` ユーティリティクラスの機能を拡張してしまっている。元々 `border-t` は、「付与された要素に上ボーダーを設定する」というただ一つの要求を満たすものだった。

しかし独自の定義により、「付与された要素に上ボーダーを設定する。もし `toolbar` クラスがある要素に隣接し、`section` クラスが付与されている要素に付与されるなら、マージンを 0 にする」というものになった。

この場合、ただ単に `@apply` された箇所でプロパティを展開するだけでは、要求が満たせなくなってしまう。なぜなら `.custom-class` には隣接セレクタ等の「条件文」が付与されていないからだ。

```html
<style>
  .toolbar + .section.border-t {
    margin: 0;
  }
  .custom-class {
    border-top: 1px;
    background-color: #000;
  }
</style>

<div class="toolbar">...</div>
<!-- border-tが付与されていないので、↑ がマージン0にならない -->
<div class="section custom-class">...</div>
```

これを回避するために、Tailwind CSS は `border-t` が正しく適用されるようによしなに CSS を生成するようになっている、らしい。

```html
<style>
  .toolbar + .section.border-t {
    margin: 0;
  }
  .toolbar + .section.custom-class {
    margin: 0;
  }
  .custom-class {
    border-top: 1px;
    background-color: #000;
  }
</style>

<!-- custom-classをよしなに処理してくれたので正しいスタイルになる -->
<div class="toolbar">...</div>
<div class="section custom-class">...</div>
```

> The golden rule of @apply is that you should be able to extract a set of classes to a custom class without changing any behavior.

`border-t` は何かの条件でマージンを 0 にする、という本意ではない機能追加が行われた。
この挙動から、ユーティリティクラスがユーザーの定義によって複数の機能を持つように拡張されてしまったことがわかる。これは一つのスタイリング要求をこなすというユーティリティクラスの前提が崩れ、スタイリング結果が予測困難になることへ直結する。

これを避けるために、影響範囲を閉じられるコンポーネントの内部で `@apply` を取り回す必要があるが、そこでバンドルの問題に直面する。

## @apply はバンドルサイズを増加させる

最初の例をもう一度見てみる。

```css
.custom-class {
  max-height: 350px;
  &:before,
  &:after {
    content: '';
    @apply block sticky left-0 right-0 -mt-2 pb-3;
  }
}
```

これはビルドするとこうなる。

```css
.custom-class {
  max-height: 350px;
}
.custon-class:before,
.custon-class:after {
  content: '';
  position: -webkit-sticky;
  position: sticky;
  left: 0px;
  right: 0px;
  margin-top: -16px;
  display: block;
  padding-bottom: 24px;
}
```

このユーティリティクラスの展開は、`@apply` されたすべてのプロパティで行われる。つまり、`@apply` が増えるほどユーティリティクラスに圧縮されていたプロパティが展開され、散らばっていくことになる。これはバンドルサイズを悪化させる。

Tailwind CSS の特徴として、ビルドされたユーティリティクラスは全てのページに style タグで埋め込まれることで、クラスを参照する各コンポーネントではグローバルスタイルの参照によって無駄な記述が減るというのがある（クラスによってスタイル定義が圧縮される）。`@apply` はこれを辞めることに他ならない。

Vue 等の scoped style の場合一意となるセレクタが付与されるためコンポーネントを利用する箇所すべてで展開されるという最悪の自体は防げている。コンポーネントファイルごとに `@apply` の分だけチャンクが太るというイメージで良いと思う。

```css
.custom-class[data-v-3ded7c1a] {
  max-height: 350px;
}
.custon-class[data-v-3ded7c1a]:before,
.custon-class[data-v-3ded7c1a]:after {
  content: '';
  position: -webkit-sticky;
  position: sticky;
  left: 0px;
  right: 0px;
  margin-top: -16px;
  display: block;
  padding-bottom: 24px;
}
```

実際に自分が関わった `@apply` を 150 箇所程度使っているプロダクトでは、追加のスタイルが生成されている(画像は VSCode のミニマップ)。多いと感じるか許容できると感じるかはそれぞれだと思うが、こうなるというのは知っておくとよいだろう。

![style.css](https://i.gyazo.com/3742f4f69620ee01e4e31523c8e8a06f.png)

## おわり

デメリットをよく理解して使うべき API であり、中心設計に添えるには難しいものだというのが個人的な結論。そもそも作者はこの機能は Tailwind CSS を作り直したなら存在しないだろうとも言っており、いつ deprecated になってもおかしくない。使う場合はエスケープハッチな API だと共通認識した上で、乱用を避けられるよう慎重に検討すると良い。

[https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)
