---
title: Vue3でtsx firstができるか検証する
description:
publishedAt: 2023-04-05
---

ふと、Vue3 で tsx な関数コンポーネントを定義しつつ、stateful に扱えるのかというのが気になった。今年の頭くらいではできなかったはずだが、VueMacros にある機能を用いれば可能なのでは？という話。VueMacros は Vue の RFC 的なコンパイラマクロ機能を実験的に試せるライブラリで、reactivityTransform が本体側から削除されて VueMacros でのサポートとなったことで名前を知った人もいるかもしれない。

今回使うのは以下のマクロ。

[https://vue-macros.sxzz.moe/macros/setup-component.html](https://vue-macros.sxzz.moe/macros/setup-component.html)

`defineSetupComponent` を使えば、`ts,tsx` ファイルで他のマクロ(`defineProps`等)を記述できる。ドキュメントにはないが、`script setup` に変換されるのであれば composition api を tsx に書ける = ステートフルな関数コンポーネントを定義できるのでは？と考えた。

以下のリポジトリにサンプルを載せてある。

[https://github.com/ushironoko/vue-macros-define-setup-component](https://github.com/ushironoko/vue-macros-define-setup-component)

## やり方

とりあえず `npm create vite` などで適当に Vue のプロジェクトをセットアップしておく。

VueMacros と TSX を利用するには、ライブラリをいくつかインストールして設定する必要がある。

```sh
yarn add -D unplugin-vue-macros @vitejs/plugin-vue-jsx"
```

`vite.config.ts` を編集する。

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueMacros from 'unplugin-vue-macros/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
  ],
});
```

`tsconfig.json` に types を追加する。

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
+   "types": ["unplugin-vue-macros/macros-global"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

これで準備ができた。

## tsx でコンポーネントを書く

`defineSetupComponent` 書いてないじゃん！？と思うかもしれないが、後述する。

簡単なカウンターコンポーネントを定義してみる。コンポーネントには `SetupFn` という型をアノテーションできて、ジェネリクスで Props の型を渡すことで親側で Props の型検査ができる。微妙なのが defineProps がインラインでしかジェネリクス型を定義できず、SetupFn と型を共有できない点。

とはいえこのコードは動く。Vue では関数コンポーネントで state の定義ができなかったが、このコードは `script setup` に変換されることでちゃんと動かすことができる。defineProps も `script setup` 上でしか動作しないものだが(マクロなので)、ちゃんと動作する。また jsx らしくテンプレートの変数化も可能。動的 CSS のようにスタイルの分岐をクラスレベルで行うのが Vue の特徴だったが、テンプレートを分割できるようになれば分岐を JS(X)の世界で完結させられる。

Counter.tsx

```tsx
import { ref } from 'vue';

type Props = {
  title: string;
};

export const Counter: SetupFC<Props> = () => {
  const props = defineProps<{ title: string }>();

  const count = ref(0);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const CounterChild = () => (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count.value}</span>
      <button onClick={increment}>+</button>
    </div>
  );
  return () => (
    <>
      <h1>{props.title}</h1>
      <CounterChild />
    </>
  );
};
```

親側も tsx で定義する。ついでにハンドラーを親から渡して動くか確認したいのでもうひとつコンポネを作ってみる。ここで `defineSetupComponent` が出てきた。詳しくはわからないが、今回のケースではルートコンポーネントが `defineSetupComponent` でラップされていれば動作するようだった。むしろ子で使用した場合チャンクが作れない的なエラーが出て動かなかった。

App.tsx からフォームのハンドラーを渡して input タグの `onChange` でアラートを出すようにしている。React.ChangeEvent のようなものが提供されていないため、`e.target.value` のような参照が型エラーになってしまう。仕方なくそれぞれに書いて回っている。

App.tsx

```tsx
import { Counter } from './components/Counter';

export const App = defineSetupComponent(() => {
  // React.ChangeEventのような型が提供されていないため自前で書くしかなさそう
  const formHandler = (e: Event & { target: { value: string } }) => {
    alert(e.target.value);
  };

  return () => (
    <div class="App">
      <Counter title={'counter'} />
      <Form formHandler={formHandler} />
    </div>
  );
});
```

From.tsx

```tsx
import { ref } from 'vue';

type Props = {
  formHandler: (e: Event & { target: { value: string } }) => void;
};

export const Form: SetupFC<Props> = () => {
  const props = defineProps<{
    formHandler: (e: Event & { target: { value: string } }) => void;
  }>();

  const inputValue = ref('');

  const onChangeHandler = (e: Event) => {
    e.preventDefault();
    props.formHandler(e as Event & { target: { value: string } });
  };

  return () => (
    <>
      <input type="text" value={inputValue.value} onChange={onChangeHandler} />
    </>
  );
};
```

ということで、tsx かつ composition api を用いた関数コンポーネントが動作した。SFC を使っていないため Volar が必要ないし、tsc のみで typecheck できる点もスマートで良い。

## 終わりに

VueMacros は実験的機能の寄せ集めなので、プロダクションで利用するにはハードルが高い。また今回わかった型周りの問題も修正されるのを待つか、自分でパッチを当てたりする等が必要だと思う。要するに時期尚早。

最後に(本当はこんなこと言及したくないが)、こういうことをやると「それするなら React でいいじゃん」という声が聞こえてきそうだが、各アーキテクチャにおいて優れていたり、直面する課題解決に有効なものを取り入れてチャレンジすることを ◯◯ でいいじゃんと安置から言うのは大変無意味な立ち振る舞いというのを頭の片隅に置いて欲しい。長いものに巻かれて気が大きくならないようにしたい。

もっと言うと、Vue は fine-graind reactivity に属するため比較対象は Solid や Qwick である。対 React に執念を燃やすのも良いが、何かに勝つことが目的になってしまうのは避けたい。結局はこれである。

> The web is not a zero-sum game. I dislike the narrative that frameworks will either win or lose, and that you need to "place a bet." Indeed, it is easy to fall into this mindset if everything is VC-backed, but not everything is, nor does it have to be.

[Evan You - Twitter](https://twitter.com/youyuxi/status/1643555701497937920)
