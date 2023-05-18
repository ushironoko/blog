---
title: 興味あること、ないこと
description:
publishedAt: 2023-05-18
---

今の自分が興味あること、ないことを書いてみる。来年の同じ時期にどう変化してるのか観測してみたい。技術系のものに絞る。

## 興味ある

- GraphQL
  - 仕事で使い込む必要が出てきたため
  - Production Ready GraphQL を読んでいる
    - 面白い、勉強になる良い本だと思う
  - RPC のような技術も一定指示を得ているが、個人的には(全てが TS で完結する世界でなければ)GraphQL 推し
    - スキーマの表現力がかなり高い
    - 一方で周辺ツールは雑多な印象がある、もう少し調査したい
- 認証・認可
  - 今の上司にあたる人が、がっとプロジェクトの雛形を作った時のコードを読んでみたら全然わからなかった
  - 特に jwt の知識
    - 自分でもやってみたが、理解が追いつかなかった
      基礎を叩き込む必要があると感じた
  - 最近は上司とかのパワーを感じるムーブを自分もできるようになりたい、という気持ちがかなり高まっている
    - 同時に、パワーのある人の年月の重みをあまり舐めない方が良いみたいな気持ちにもなる
- Cloudflare
  - 今のとこかなり信用できるクラウドベンダーな気がしている
    - やってる領域が強い
  - Workers の体験が超良くて、これに乗る技術前提で色々掘り進んでいる
    - edge で高価な計算を全部やれば良いとは思っていないが、今は色々チャレンジしてできることできないこと、向き不向きの勘所を掴みたい
  - 会社で sandbox 環境があるのでめちゃくちゃ遊べるのが良い
- Remix
  - Next の appDir からの逃避
  - Cloudflare Workers で素直に動くのでかなり選ぶ時のプライオリティが高くなっている
  - SSR 時の fetch 処理が基本ルートにしか書けないのがちょっと気になる(Nuxt3 はどこにでも書けるという対比)
- Vue
  - コンパイラマクロの異様な発達具合が面白い
  - ユーザランドで結構いじれるのでおもちゃにしやすい
    - やってることは babel マクロや文字列操作なので壊れやすそうなのは気になる
  - やっと tsx first な開発が現実味を帯びてきたので期待してる
  - 世の中の fine-graind reactivity 系ライブラリのアピールポイントを大体再現できる柔軟性があるので、正直 Vue で良くない？（良くない）って思わなくもない
    - ⚪️⚪️ で良くない？は思うだけで口にしないのが吉
- CDN キャッシュ
  - Next Fetch API の話から混乱してきた
    - デフォルトで HTTP キャッシュするという挙動
    - どこの部分でどういう手段でキャッシュするのか、というのがあまり見通し良く考えられていない
    - SWR などのインメモリキャッシュ、HTTP キャッシュ、SSR した html のキャッシュ、memcached などのストレージキャッシュなど、どいつもこいつもキャッシュしまくっている
      - GraphQL とかは全部 POST で飛ぶのでそもそも HTTP キャッシュできない、代わりにクエリに対するユニークな ID を返して key:value でキャッシュから引くのがベストプラクティス
      - じゃあ Fetch API ってどう使うんですか…？みたいなのが分かっていない
  - そもそも別にちゃんと勉強したわけじゃないので、しよう、というだけ
    - 今まではそこにある技術とドキュメントを活用していただけ
- RDBMS
  - 今までサボってたツケが来ている気がする
  - 学生のころから ER 図を見るのが嫌いで、マイグレーションという言葉にもなぜか抵抗感がある、それくらい距離を置いていた
    - のでフロントエンドの方に逃げていったというのもあるかもしれない
    - 新卒のころの上司がめちゃくちゃストアドプロシージャマンだったせいか、生 SQL を書くことには抵抗ない
  - Cloudflare に D1 が来て、Workers 触るなら D1 も触れないとなぁとぼんやり思うようになったところで mizchi さんの Remix + Pages + D1 のサンプルが降ってきた
  - タイミングだなぁと思いやる気が出たが、まあどこからやればいいかわからん（認証・認可も同様）

## 興味ない

- UI ライブラリ
  - 長らく自社で UI を作る環境にいるので、radix ui のようなヘッドレスなやつとかも全然触れていない
  - 基本的に誰かが実装してくれたものを使うというのは減らせるなら減らしたい
  - 必要品質を満たせるくらいの実力があるのか？と言われたら多分ない
    - でも持ち合わせていないから自分で作るのをやめて、ありものを使うというのも完全に正しいかと言われると違う気がする
    - ありものから得られるものも当然ある、難しい
  - 実装を参考にすることはあるが、利用することはあまりないくらいの話
  - 悩んでいる
- 型パズル
  - どこからが型パズルでどこからが実務で普通に書くなのか意識統一されていない
    - 俺は読みにくいと感じたと言われたらそれまでな気がする
    - あまりルールを引いてもしょうがないのでは？と思ってしまう
  - これはただ自分が複雑な API だが開発者に情報を正確に届けなければならないみたいな領域をあんまり書いてないだけかもしれない
  - 悩んでいる
- LLM
  - これを興味ないというのは良くない気がするが…
    - ちょっとやろうと思ったが、正直分野が全然違いすぎて最初のハードルを越えられなかった
  - やるなら仕事で要求されないとできない気がしている
    - こういう部分に貪欲にいける人は本当に尊敬する
  - 悩んでいる
- ブロックチェーン
  - 基礎がなってないのでこんなものを触ってる場合ではない
- アイランドアーキテクチャ、Resumable 等
  - 興味ないというか、誰が必要なのかあんまわかってない
  - hydration がオーバヘッド理論は理解できるけど賛同もしない
    - 辞めたら失うものって色々あると思うし、得るものもどれくらい体感できるんだろうという感じ
    - 大規模で違う実装のアプリを用意して比較するのが大変すぎて誰もやってない
  - 全ページ SSR（hybrid rendering でない）するとページ遷移がもっさりするのが時代後退している気がする
    - リンクの先読みで改善するんだろうなとは思うけど、じゃあ SPA でも良いじゃんみたいな
    - 初回レンダリング以外を SSR にするメリットがあんまりピンと聞いてないかもしれない
  - 特に E コマースでカートのみを hydration できてはやい！と聞いていたのにどこかのスライドで EC は難しいと書かれていてげんなりしたのもデカい
    - そもそもどんな技術を使ってようが Amazon を超えるパフォーマンスを出せるかはまた別の話と思う
- 悩んでいる

## おわり

他にもある気がするけどパッと思いついたやつだけ書いた。今の自分の興味は完全に Cloudflare を起点にしていて、興味の範囲が広がって嬉しい反面自分のダメさに打ちひしがれることもある。
腐らずに結果にできるかがキャリア的にも重要だろうと思っていて、良い環境・良い知り合いに恵まれていると本当に感じるのでなんとかものにしたい（知り合いが出来すぎててどうしても比較してしまう）。

興味ない、とはいったものの今の自分に必要ないだけで将来どうなるかわからないし明日にはやってる可能性は十分ある。これらの要素への執着と理解がない、と読み替えても良いかもしれない。