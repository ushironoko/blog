---
title: Tailwind CSSが生成するクラス順の影響
description: 誤パージとか言ってすいませんでした
publishedAt: 2021-06-20
---

Tailwind CSS には jit モードという利用されているユーティリティクラスのみを順次生成する機能がある。これを利用するとパージ処理が不要になるためビルド時間がかなり短縮できたり、複雑なクラスの生成（擬似要素とか）も可能になって嬉しいらしい。ちょうど最近のリリースで `before` と `after` 擬似要素が利用できるようになった。

https://blog.tailwindcss.com/tailwindcss-2-2

生成する要素もデフォルトで空文字だが任意の文字列を指定できたりする、確かに複雑そう。ということで Vue でも plugin を削ったり `@apply` や SCSS に依存したクラスを減らしていくべく導入しようとした。

## 動的クラスがパージされる？

さっそく SFC ファイルで利用しようとした。元々擬似要素を使えるようにするプラグインを入れていたので、バージョンアップとともに削除して、擬似要素の置き換え前にそもそも動作するのか検証した。

https://github.com/croutonn/tailwindcss-pseudo-elements

以下のようなファイルで試した。元々 jit モードを指定せずに動作していた（色々省略してます）。

```vue
<template>
  <div
    class="relative inline-block w-full overflow-hidden border-2 border-gray-300 border-solid rounded-md text-gray-80 h-14"
    :class="`${focusedClass}`"
  >
    <label class="relative flex items-center h-full px-2 cursor-text">
      <span class="absolute text-gray-400 select-none">
        {{ label }}
      </span>
      <input v-on="listeners" />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useFocus } from '../../composables/eventHandler';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  emits: {
    focus: (event: Event) => true,
  },
  setup(props) {
    const { isFocus, handleFocus } = useFocus({ eventName: 'focus' })

    const focusedClass = computed(() =>
      isFocus.value ? 'border-blue-700 ring-4 ring-blue-100 transition duration-100' : ''
    );

    const listeners = computed(() => ({
      focus: handleFocus,
    }));

    return {
      focusedClass,
      listeners,
    };
  },
});
</script>
```

`focus:` を使ってないじゃないかという指摘はごもっともだが、 js が管理する値でクラスを付与したい時もあるだろうということで今回は堪忍願いたい。フォーカスが有効になると input のボーダーが `border-gray-300` から動的クラスで指定した `border-blue-700` へ変化する。しかし jit モードを有効にすると動作しなくなってしまった。

jit 未指定時

![inputのフォーカスリングが表示されているgif](https://i.gyazo.com/f058df9498a799101f419c03dceb5570.gif)

mode: 'jit' 時

![inputのフォーカスリングが消えているgif](https://i.gyazo.com/748f271139f6c8de53a4f498afde8e7b.gif)

この現象に似たものとして Windi CSS を使った時を思い出した。Windi CSS は動的な CSS に対応していないため上記のように書くと未使用扱いになりパージされてしまう。Windi CSS はデフォルトで jit モードと同じくオンデマンドにユーティリティクラスを生成していて、jit モードでも同様に動的クラスを見てくれないのかもしれないとこの時は思っていた。

とりあえずプロダクションビルドではどうなるんだろうかとビルド結果を見てみると、しっかり `border-blue-700` が出力されていた。jit モードは本番と開発で同様の出力結果になるらしく環境の違いではなさそう。

![バンドルにblueが含まれていることがわかる写真](https://i.gyazo.com/762247745feefc0880e8fdab6a055b11.png)

https://tailwindcss.com/docs/just-in-time-mode#enabling-jit-mode

>Your CSS is identical in development and production.

直接見た方が早そうなので html に埋め込まれているユーティリティクラスを見たら、ちゃんと出力されていた。ちなみに tailwind.css 内で Preflight を読み込んでいる場合 base → utilityの順だと長すぎてユーティリティクラスが省略されてしまうので utility → base の順に読み込ませておくと良い。

![ちゃんとblueが生成されていることがわかる写真](https://i.gyazo.com/5be38c1f01854c75137fd4129c064da7.png)

assets/tailwind.css

```css
@tailwind utilities; // 先に読み込む
@tailwind base;
```

よくみると `border-blue-700` が存在するのに無効になっていた。`border-gray-300` に上書きされてるっぽい。つまりこれは双方のユーティリティクラスの定義順によって後から動的に当てた同じデータ型のスタイルを上書きしてしまうという現象だった。

![blueがgrayに上書きされている写真](https://i.gyazo.com/d958a7d1d5e33ccf7ace593622cd671a.png)

実際に jit モード時と通常時で出力されるユーティリティクラスを比較すると、通常時では `border-blue-700` が `border-gray-300` より後になっているが jit では順序が変わっている事が分かった。

![jitモードとそうでないときの生成されたコードのdiff写真](https://i.gyazo.com/8bac8b6796a9cc6cb7ac268e386a5490.png)

通常のパージ処理は全てが定義された状態から不要なものを落としていくため `border-blue-xxx` というクラスでまとまって定義されるが、jit モードではビルド時の出現順に生成していくっぽく並び順が（生成されるファイルを見ない限り）予測不能な状態になっていた。これにより元々 gray が先に定義されていて運良く動いていたものがスタイルの上書きによって動かなくなったというのが真相。

回避するには単純に動的なクラス割り当てをやめるか、一時的に同じデータ型のスタイルを持つユーティリティクラスを外すなどする必要がある。そもそも出来る限りテンプレートレベルで分岐させるべきという話かもしれない。

今回の敗因は上書きによってうまくいっていたと見せかけて実は脆い設計だったということで、動的クラスを生成する computed に `border-gray-300` を移動すれば順番に左右されなくなる。サボらず書きましょう。

```ts
const focusedClass = computed(() =>
  isFocus.value ? 'border-blue-700 ring-4 ring-blue-100 transition duration-100' : 'border-gray-300'
);
```

## まとめ

- jit モードでも SFC 内で動的に記述したユーティリティクラスを生成できる
- jit モードでは生成されるクラスの順序がビルド時の出現順になる
- スタイル分岐はなるべくテンプレートレベルでの分岐をしておくと色々な面で安心できそう

動くからといって動的クラスで暗黙のスタイル上書きをしていたみなさんはこれを気に jsx を検討してみてはいかがでしょうか（？）。
