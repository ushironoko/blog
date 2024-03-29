---
title: 考えるVuex
description: Vuexってなんで今も使ってるんだっけを考えました
publishedAt: 2020-12-28
---

Vuex って何が良いんだっけ/今なんで使い続けてるんだっけを考えていたらややこしくなってきたのでここに全部まとめる。実は数年前から各所で散々言われている話なので今更感が強い。

## Vuex を使う理由

公式に完璧に表現されているので引用

> Vuex は Vue.js アプリケーションのための 状態管理パターン + ライブラリです。
> https://vuex.vuejs.org/ja/

Vuex は状態管理のためのライブラリではなく、状態管理パターンを実現するためのライブラリというのが大前提にある。
Vuex は状態の更新 API を単方向フローに縛ることで View を生成する状態の信頼性を担保する Flux アーキテクチャを Vue へ持ち込むライブラリ。つまり我々は Flux を Vue でやりたいから Vuex を使っている。では Flux を持ち込むと何がよいのか？

## Flux パターンを使うと何が良いのか

まず自分が感じている Flux パターンのメリットはこんな感じ

- 参照側を全部更新して回る必要がないのでリアクティビティに丸投げして開発ができる(更新し忘れがない）
- どのコンポーネントから見ても正しい値として担保されているので安心して扱うことができる
- mutation, aciton でやるべきことが決まっていているので開発時の考え事が減る

Flux が謳っている single source of truth はこれらを成り立たせるのに必要な概念で、単方向フローを確実なものにすることで堅牢性とシンプルさを両立することができる。実際の Vue（Nuxt）開発でもこれらの恩恵を受けながら開発できているため、Vuex から始めたことは大きな意義がある。ただ、このまま Vuex を使い続けるべきかと言われると一考の余地があると自分は思う。

## 脱 Vuex はするべきか

Vuex で出来ないことがそのままサービスの成長を疎外するようなら辞めるべき。メリットを理解して享受できていても、ライブラリは今まさにスケールさせようとしている自分たちのサービスの都合や開発者の期待値を考えて設計されていないため、いつか摩耗する。

では Vuex は現状理想の運用に耐えうるものかどうか、というと確実にそうではないと思う。これは Vuex に対して開発者が求めすぎた結果でもあるし、Flux パターンの規約がそこまで考慮されていない軽量なものということでもある。

### Vuex に空いている穴

Vuex は現状以下の点で、Flux パターンを持ち込むよりも多くのデメリットがあると感じている。

- state の直参照ができる&マッピングの API が生えている
- 名前空間の分割に独自の module 分割(namespace)機構を使う必要がある
- やることの粒度にかかわらず常に同じ形をした API とフローを定義する必要がある
- TypeScript との相性が良くない

ここで、以下を考えてみて欲しい。

- Vuex で確実に Flux パターンを守り切ることができるか
  - state を直接参照することによる潜在的な割れ窓を説明できるか
- namespace による分割が 100 や 200 になった姿を想像して、メンテできる自信があるか
- 何を Vuex に任せるのが良いのかを考えた時に、やるべきではないと判断する軸が機械的に決まるか
- TypeScript で完全に型付けがされている Vuex が動いている場合、何をどこに書けばどういう型のサポートを受けられるかはっきり想像できるか

上記にあげた例は別に Vuex が悪いという話ではなくて、今我々はこれらのニーズを Vuex に求めてしまっていて、Vuex はそれを考慮していないという事実があるという事。

また、Vuex の namespace のようなモジュール分割手法ではそれより小さな粒度で取り回すことが難しく、test を書く場合 namespace の粒度に大きく影響されるという点も辛い。とにかく必要以上に大きな状態を持つということは相応の代償もあるということを再認識する必要がある。**大きい**ということは**意図しないものを含んでしまう可能性を常に考慮するべき**という話。Vuex のいる場所は、フロントエンドにおいてそれ以上外側がない領域だと考えよう。

#### 余談

Vuex は悪くないとは言いつつも良くないと思っている API はいくつかある。state の直参照に関しては最悪で、Flux フローを容易に破壊する記述が可能な状態になっている。

```ts
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.state.obj.message = value
    }
  }
}
```

computed には getter と setter をはやすことができるため、Vuex state だろうが問答無用でコンポーネント側から書き換えられる。state の直参照は API レベルでできないようにするべき。マーフィーの法則に以下がある。

> If there's more than one way to do a job, and one of those ways will result in disaster, then somebody will do it that way.

できるのならいずれ誰かがやる、人類は愚かなので。

### 自分で実装しないということの言い訳

と書くとちょっと攻撃的になってしまうが、言いたいのは Vuex でやりたいことが実現できるからと言ってその副作用を考えずに使い続けるのは難しいということ。状態管理は主語が大きく、グローバルステートによる状態管理と Context や Headless Instance による粒度分割をした状態管理では役割が全く異なるため、Vuex では大きすぎて不自由になると判断したら自前で状態管理をやっていかなければならない。

## Nuxt 2 時代、Nuxt 3 からはどうか

Nuxt2 時代では Vue.observable + Inject で this に対して DI することで、コンポーネントより外に状態を露出することなく context からリアクティブな値を使うことができた。Vue.observable は単体でも Headless Instance として利用でき、グローバルに露出せずに共有される状態を実現できる。

Vue 3 において新しくその立ち位置にくるのは inject と provide だが、これの設計についてはまだ誰も規約めいたことをやれていない。つまり再発明する必要がある。Vuex はグローバルにいるということがメリットとなる要件にのみ利用し、その他コンポーネントやページ間のデータの協調をどうするかを考える。OSS になっている必要はなくて、プロダクトの中で積み上げていけば良いと思う。

長くなってきたので一旦〆

参考
https://speakerdeck.com/potato4d/the-last-architecture-of-the-vue-2-dot-x
https://techblog.elevenback.co.jp/entry/2019/12/24/020840
https://speakerdeck.com/tooppoo/vuexdehe-wosuruka-he-wosinaika
https://qiita.com/tmy/items/a545e44100247c364a71
