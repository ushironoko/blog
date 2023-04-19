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

一方で、作者の Adam 氏は `@apply` の使い方を強く辞めるように提言している。ドキュメントにもまた、「見た目を整理するためだけに使わないように」という章があったりする。

とてもわかりやすい例が 2 つある。ユーティリティクラスの予測できない拡張と、バンドルサイズへの影響だ。これら 2 つについて簡単に触れる。

## @apply はユーティリティクラスの機能を予測できなくする

説明に良い issue があるのでこれを例にする。

[https://github.com/tailwindlabs/tailwindcss/discussions/7975](https://github.com/tailwindlabs/tailwindcss/discussions/7975)

例えばこういうスタイル定義があるとしよう。

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

しかし独自の定義により、「付与された要素に上ボーダーを設定する。もし `toolbar` クラスがある要素に隣接し、`section` クラスが付与されている要素に付与されるなら、マージンを 0 にする」というものに拡張されている。

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

`border-t` は何かの条件でマージンを 0 にする、という本意ではない機能追加が行われてしまった。
この挙動から、ユーティリティクラスがユーザーの定義によって複数の機能を持つように拡張されてしまったことがわかる。これはスタイリング結果を予測困難にすることに直結する。

これを避けるには、コンポーネントに閉じた状態で `@apply` を取り回す必要があるが、バンドルの問題に直面する。

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

Vue 等の scoped style も例に漏れず、以下のような形でビルドされる。コンポーネントごとに `@apply` の分だけチャンクが太るというイメージで良いと思う。

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

## おわり

ドキュメントに明記されている以上、そのデメリットをよく理解して使うべき API であり、中心設計に添えるにはそれなりに理解の必要なものだというのが理解いただけただろうか。
そもそも作者はこの機能は Tailwind CSS を作り直したなら存在しないだろうとも言っており、いつ deprecated になってもおかしくない。使う場合は正当な理由が必要だし、そういう心づもりでいるべきだと思う。

[https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction](https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction)
