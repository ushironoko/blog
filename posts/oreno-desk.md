---
title: Thunderbolt1本で完結するデスクトップ環境を構築する
description:
publishedAt: 2022-04-27
---

気がついたらもう 4 月で、今年に入って 2 本目のブログになる。
最近は忙しさと書きたいもののなさで全然更新できてなかったが、去年末あたりから進めていたデスク周りの最適化が終わりつつあるのでまとめる。

## 図解

まず自分のデバイス周りを図解する。各種デバイスの紹介は後ほど。

[![Image from Gyazo](https://i.gyazo.com/09c445f4a921a7b1cb552a484dfa6ef8.png)](https://i.gyazo.com/09c445f4a921a7b1cb552a484dfa6ef8.png)

コンセプトは Thunderbolt で完結する環境で、ほとんどのデバイスはドックに集約されている。

マイクや Stream Deck といったデバイスは仕事でもプライベートでも使うため、ドックから Thunderbolt 1 本で私用 mac 、仕事用 mac 、ゲーミング PC（Windows）間の接続を切り替えられるようにした。

ルーターが別の部屋にあるため有線接続できていなかったが、今年に入ってからメッシュ Wi-Fi を導入したので自室の Deco X60 に LAN ケーブルで繋げるようになった（図にないが Switch も Deco に有線接続されている）。

キーボードとマウスは Bluetooth で繋がっていて、キーボードは都度接続先を切り替えて運用する。マウスは mac では出番がないのとドングルが必要なこと、ドックの USB-A ポートの余りがないことからゲーミング PC に直接繋がっている。

この構成のもう一つのポイントはメインモニタの切り替えにあり、状況に応じてサブモニタとは違う出力を選べるようになっている。

よく使うパターンは

- メイン私用 mac、サブ私用 mac
- メイン仕事用 mac、サブ仕事用 mac
- メイン Switch、サブ私用 mac
- メイン Switch、サブゲーミング PC
- メインゲーミング PC、サブ私用 mac

など。メインモニタのみスイッチャーを経由するためにそれぞれのデバイスから HDMI で接続している（サブは全てドック出力）。スイッチャーは基本自動切り替えだが、机の裏に固定しているので手動でボタンを押して切り替えることもできる。

[![Image from Gyazo](https://i.gyazo.com/a239f051de0ceb114cdd0b6645886f29.jpg)](https://i.gyazo.com/a239f051de0ceb114cdd0b6645886f29.jpg)

また一緒に机の裏にキャプチャボードを固定しており、Switch はキャプボを経由してメインモニタに繋がっている。キャプボはドックに挿しっぱなしで、常に PC 側でキャプチャできる。のちに紹介するが Stream Deck でゲーム画面の録画やスクショを撮ることも可能。

少し写っているのでついでに紹介するが、エネループを常に充電していて HHKB のバッテリーが切れても問題ないようにしている（最近ひろゆきの切り抜きでエネループの話をしているのを思い出して買った）。

配線周りもある程度改善させており、改善前は地獄だったがかなりスッキリした（だらしない部分はまだあるが）。

Before

[![Image from Gyazo](https://i.gyazo.com/315997b6a389ecf4617741d54e42218d.jpg)](https://i.gyazo.com/315997b6a389ecf4617741d54e42218d.jpg)

After

[![Image from Gyazo](https://i.gyazo.com/b742177a9a445b9fc25dd403b40a236d.jpg)](https://i.gyazo.com/b742177a9a445b9fc25dd403b40a236d.jpg)

そのうちまた見直すと思う。

## 机上&デバイス詳細

机上はこんな感じ。

[![Image from Gyazo](https://i.gyazo.com/9675312e301cdfb707303c740cf1d335.jpg)](https://i.gyazo.com/9675312e301cdfb707303c740cf1d335.jpg)

写っているものに関してそれぞれ詳細を書いていく。

### モニタ周り

メインモニタは [BENQ ZOWIE XL2411](https://www.amazon.co.jp/%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%A2%E3%83%8B%E3%82%BF%E3%83%BC-%E3%83%87%E3%82%A3%E3%82%B9%E3%83%97%E3%83%AC%E3%82%A4-ZOWIE-XL2411-24%E3%82%A4%E3%83%B3%E3%83%81/dp/B01LZUO3MV)、サブは [Acer KG251](https://www.amazon.co.jp/gp/product/B0756CV1CG/)。5,6 年前に買ったやつをずっと使っている。ゲームでも使うので色が綺麗に出るやつとかが使えない問題がある（ゲームで使うと酔う）。

2 枚ともモニターアームで釣っている。[エルゴトロン LX デスクマウントアーム](https://www.amazon.co.jp/%E3%82%A8%E3%83%AB%E3%82%B4%E3%83%88%E3%83%AD%E3%83%B3-%E3%83%87%E3%82%B9%E3%82%AF%E3%83%9E%E3%82%A6%E3%83%B3%E3%83%88-%E3%83%A2%E3%83%8B%E3%82%BF%E3%83%BC%E3%82%A2%E3%83%BC%E3%83%A0-%E3%83%9E%E3%83%83%E3%83%88%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF-45-241-224/dp/B07Q8TJ2KL/) を 2 つ使っている。

メインモニタに乗っているカメラは [ロジクール C980GR](https://www.amazon.co.jp/%E3%83%AD%E3%82%B8%E3%82%AF%E3%83%BC%E3%83%AB-%E3%82%AA%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%AB%E3%82%B9-StreamCam-C980OW-2%E5%B9%B4%E9%96%93%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E4%BF%9D%E8%A8%BC/dp/B086R71LGW/) という Web カメラ。リモート主体になってきてクラムシェル運用を始めたあたりに買った。使うときはドック前面の type-c ポートに挿して使う。

サブモニタにはモニタの上に物が置けるようになる [ロボロビン ディスプレイボード](https://www.amazon.co.jp/gp/product/B07WSV5G2M/) をつけている。

### PC

仕事用のは M1MAX 14 インチ、私用のは 2019 年モデルの MBP 13 インチ。スタンドで立てておいて、常にクラムシェル運用している。充電が切れないように、使っていない方の mac には純正の充電アダプターを挿している。

[![Image from Gyazo](https://i.gyazo.com/d69337f26511ce9e794c4952a6bdb139.jpg)](https://i.gyazo.com/d69337f26511ce9e794c4952a6bdb139.jpg)

左の黒い箱が [intel NUC 12 Extream Kit](https://www.intel.co.jp/content/www/jp/ja/products/sku/216963/intel-nuc-12-extreme-kit-nuc12dcmi9/specifications.html)。

[![Image from Gyazo](https://i.gyazo.com/bacfeeb0a08c95c4f8709c51eabd94a5.jpg)](https://i.gyazo.com/bacfeeb0a08c95c4f8709c51eabd94a5.jpg)

最近発売されたもので、Thunderbolt 対応のゲーミング PC をどうしようか考えていたところ知人に紹介されてこれでいいじゃんとなり購入。ベアボーンなのでメモリ、SSD、グラボ、OS あたりは別途購入が必要。

最初どこで売ってるのかわからなかった（Amazon には 11 世代モデルしかなかった）が偶然アークオンラインストアで買えるのを見つけた。本当は i7 モデルで十分だったが i9 モデルしかなくて泣きながらお金を出した。高い。

まだグラボを挿していないので懐に余裕ができたら現状値下がりつつある 3060ti あたりを買おうかなと考えている。まあ 40 番台が出ることも考えるとちょっと待っても良いかもしれない。

補足情報として M.2SSD が 3 枚挿せるがいずれもヒートシンクが付属しているので別途購入する必要はない。むしろネジ穴が干渉してケースが閉まらなくなる恐れがある（1 敗）。

RAM はノート PC 向けの SO-DIMM となる。グラボは 35cm までの大きさであれば入る。小さいため排熱が気になる人はトリプルファンのものを買うと良いかもしれない。

あと正面の髑髏マークのネオンは設定で切れる。よかった。

### キーボード&マウス周辺

[![Image from Gyazo](https://i.gyazo.com/433a02360cedca5c4c97425746766a16.jpg)](https://i.gyazo.com/433a02360cedca5c4c97425746766a16.jpg)

キーボードは [HHKB Professional HYBRID Type-S](https://www.amazon.co.jp/HHKB-Professional-HYBRID-%E6%97%A5%E6%9C%AC%E8%AA%9E%E9%85%8D%E5%88%97%EF%BC%8F%E5%A2%A8-PD-KB820BS/dp/B082TSZ27D/) の日本語配列有刻印を使っている。Bluetooth で 4 台まで接続切り替えができる。またドック前面の type-c ポートでどの PC にも有線で繋げられる。

パームレストは [FILCO の漆塗りリストレスト　摺漆塗り S](https://www.diatec.co.jp/shop/det.php?prod_c=3652)。初期傷があって悲しい。

トラックパッドは純正の [Magic Trackpad 2](https://www.amazon.co.jp/Apple-Magic-Trackpad-2-MJ2R2J/dp/B016ZE7K8O)。Bluetooth でも繋げるが、私用/仕事の mac 間を切り替えるのにどのみち有線接続が必要で、一々つけるのも面倒ということで繋ぎっぱなしにしている。

書籍の左、サブモニタの下あたりにゲーム用のマウスがある。マウスは [Razer Viper Ultimate](https://www.amazon.co.jp/Razer-Ultimate-%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%9E%E3%82%A6%E3%82%B9-Chroma%E3%80%90%E6%97%A5%E6%9C%AC%E6%AD%A3%E8%A6%8F%E4%BB%A3%E7%90%86%E5%BA%97%E4%BF%9D%E8%A8%BC%E5%93%81%E3%80%91-RZ01-03050100-R3A1/dp/B07ZD46659/) で、常に充電スタンドに置いてある。

黒いマットは [ULTIMATE GUARD のプレイマット](https://www.amazon.co.jp/Ultimate-Guard-UGD010193-%E3%83%97%E3%83%AC%E3%82%A4%E3%83%9E%E3%83%83%E3%83%88/dp/B00P9FJVAG/) で、紙の遊戯王をしばくついでに普段使いしている。ウルトラプロのを使っていたが、カップ麺の油が飛んだ時に歪んでしまったのでこれに買い替えた。こちらの方が質感が良くて気に入っている。

実は机上台の下に HHKB の 25 周年モデル（雪）も置いてあるがほとんど使っていない。

### 机上台周辺

机上台にはドックと（図で書き忘れた）Bluetooth スピーカーを置いている。机上台の前にあるのが Stream Deck MK.2。メインモニタを持ち上げるとこんな感じ。

[![Image from Gyazo](https://i.gyazo.com/8b4fc2908a688481ac9debc5e2b0fa20.jpg)](https://i.gyazo.com/8b4fc2908a688481ac9debc5e2b0fa20.jpg)

ドックは [Belkin CONNECT Pro 12-in-1 Thunderbolt 4 Dock](https://www.amazon.co.jp/gp/product/B09KLLNTW4/)。値は張るが動作が安定しており穴も多い。何よりコンセプトである Thunderbolt で完結する環境には必須のアイテムだった（これをおすすめされた時にコンセプトを決めた）。

正面から出ている Thunderbolt ケーブルを任意の PC につなぐことで、さまざまなデバイスをスムーズに移動できる（mac の場合は給電も兼ねる）。

Bluetooth スピーカーは [Denon DSB250BT ポータブルワイヤレススピーカー Envaya](https://www.amazon.co.jp/gp/product/B0777KNQH2/)。aptX LL という低遅延接続のコーデックに対応していて、ゲームをやる上ではマスト要件だった。実際ほとんど遅延を感じないためかなり満足している（電源ボタンがマジで硬いのがマイナスポイント）。

基本は Switch に接続しているが、Switch 本体の Bluetooth は aptX LL 非対応なため対応している [サンワサプライの Bluetooth トランスミッター](https://www.amazon.co.jp/gp/product/B091DJFVRH/) を Switch に挿して使っている。

手前のが [Elgato Stream Deck MK.2](https://www.amazon.co.jp/Elgato-%E3%82%A8%E3%83%AB%E3%82%AC%E3%83%88%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%A0%E3%83%87%E3%83%83%E3%82%AF-MK-2%E3%80%9015%E3%82%AD%E3%83%BC%E9%85%8D%E5%88%97%E3%80%91%E3%83%A9%E3%82%A4%E3%83%96%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E4%BD%9C%E6%88%90%E7%94%A8%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9%E3%83%BC-%E9%85%8D%E4%BF%A1%E8%80%85%E5%90%91%E3%81%91%E3%83%87%E3%83%90%E3%82%A4%E3%82%B9-YouTube%E9%80%A3%E6%90%BA-Mac/dp/B09738CV2G/)。何者かよく聞かれるが、いわゆるストリーマー向けの叩き的なもので、15 個のボタンにそれぞれアクションを割り振ることで 1 タッチで任意の操作ができるというもの。

マイク/スピーカーの入出力の切り替えや Voice Over 切り替え、Slack の勤怠コマンド、次のミーティングをブラウザで開くなど結構自由に設定できる。

整理したら 4 つ余ってしまったので何か入れたい。

机上台はこれ。

https://www.amazon.co.jp/gp/product/B08PK6DNTZ/

適当に机の雰囲気と合うやつを探して買った。ドック + スピーカーの横幅を満たせるものの中ではこれが一番良さげだった。

### Wi-Fi 環境

TP Link の [Deco X60](https://www.amazon.co.jp/gp/product/B0873GL9F6/) でメッシュ Wi-Fi を導入した。各デバイスへは同じく [TP Link の 5 ポートスイッチングハブ](https://www.amazon.co.jp/%E3%80%90Amazon-co-jp%E9%99%90%E5%AE%9A%E3%80%91TP-Link-%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E3%83%B3%E3%82%B0%E3%83%8F%E3%83%96-1000Mbps-%E3%83%A9%E3%82%A4%E3%83%95%E3%82%BF%E3%82%A4%E3%83%A0%E4%BF%9D%E8%A8%BC-TL-SG105V4-0/dp/B00A128S24/) 経由で有線で繋いでいる。置き場所に困ったが、カゴに入れてもう使っていないゲーミング PC の上に置いている。調子が良いときは上り下り共に 500Mbps 程度出る（回線は So-net の v6 プラス）。専用のアプリもそこそこ使いやすい。

[![Image from Gyazo](https://i.gyazo.com/a8ab5aca29d3c1afa0e94487a24fed53.jpg)](https://i.gyazo.com/a8ab5aca29d3c1afa0e94487a24fed53.jpg)

買った後に TP Link 周りできな臭いニュースが流れてきてそういうリスクもあるなぁとなった。まあ様子見。

### 充電環境

環境といっても 1 つだが、Anker 533 Wireless Charger (3-in-1 Stand)を使っている。最近発売されたやつで、Apple Watch や AirPods も充電できてとても便利。スマホの充電スタンドは使い出すとやめられなくなる。

[![Image from Gyazo](https://i.gyazo.com/73862fab20d1531dd40af71bcf7f6cde.jpg)](https://i.gyazo.com/73862fab20d1531dd40af71bcf7f6cde.jpg)

https://www.amazon.co.jp/gp/product/B09LCMZ39T/

ちなみにこれが発売される前は ↓ の充電スタンドを使っていた。これはこれでコンパクトで便利だった。

https://www.amazon.co.jp/gp/product/B07WGPPZQK/

そのほかのデバイスを充電するときは基本的にドック前面の type-c ポートを使うか、トラックパッドに繋がっている Lightning ケーブルを使う（ほぼないけど）。Switch のプロコンを寝る前に繋いだりしている。

### ゲーム関連

[![Image from Gyazo](https://i.gyazo.com/6e87c15bc359d2af550fc46914f29adf.jpg)](https://i.gyazo.com/6e87c15bc359d2af550fc46914f29adf.jpg)

Switch は有機 EL モデルで友人から定価で買い取った。先ほども書いたがキャプチャボードを経由して [HDMI スイッチャー](https://www.amazon.co.jp/gp/product/B08T1YXDDJ/) に繋がっている。電源をつけるとメインモニタがゲーム画面に切り替わって便利。

キャプチャボードは [Elgato HD60S](https://www.amazon.co.jp/Elgato-%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%83%BC-%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%89%E5%BC%8F-%E4%BD%8E%E3%83%AC%E3%82%A4%E3%83%86%E3%83%B3%E3%82%B7%E3%83%BC-USB3-0/dp/B01DRWCOGA)。なぜか miyaoka さんが買ってくれたので使わせてもらってる。mac では OBS Link 経由での送信ができないらしく、OBS を使いたいなら Windows につなぐ必要がある（OBS でなくても専用のソフトであれば動く）。この環境であれば Thunderbolt を Windows に挿せば OK。

PS5 はリビングにあるのでデカい画面でやりたいモチベーションのないゲームは Switch かゲーミング PC でやるようにしている。

そのほかの小物もここに置いてある。白黒のだるまは会社の忘年会ビンゴで当たった。

L 字の台はニトリで買った [ウォールシェルフの 45cm](https://www.nitori-net.jp/ec/product/8131321s/)。壁には穴が目立たないタイプの小さいピンで固定できる。

[チロシン](https://jp.iherb.com/pr/now-foods-l-tyrosine-500-mg-120-capsules/836)は飲むと頭が良くなる。

### マイク&ヘッドホン

[Blue Yeti](https://www.amazon.co.jp/Blue-Microphones-%E3%82%B3%E3%83%B3%E3%83%87%E3%83%B3%E3%82%B5%E3%83%BC-BM400BT-2%E5%B9%B4%E9%96%93%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E4%BF%9D%E8%A8%BC/dp/B0822PMBTZ/) + [Blue マイクアーム](https://www.amazon.co.jp/gp/product/B0822PPK7P/) + [Blue ショックマウント](https://www.amazon.co.jp/gp/product/B0822NRR6W/) のセット。USB 接続でバスパワー給電できて便利。音質は可もなく不可もなくという感じだがガチのストリーマーでもないので十分だと思う。今買うなら新モデルの Yeti X を買うと良さそう。

机の角にヘッドホンを釣っている。ヘッドホンは [DROP + Sennheiser PC38X](https://www.amazon.co.jp/Drop-Sennheiser-PC38X-%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%98%E3%83%83%E3%83%89%E3%82%BB%E3%83%83%E3%83%88-%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%82%A4%E3%83%A4%E3%83%BC%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%83%90%E3%83%83%E3%82%AF%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3/dp/B08TX6GQTB) で、まれに使うがすぐ頭が痛くなるので値段ほどの活躍はさせられてない（のもあってスピーカーを買った）。

[![Image from Gyazo](https://i.gyazo.com/f3feff7c2fbd6ea87a268377383b9337.jpg)](https://i.gyazo.com/f3feff7c2fbd6ea87a268377383b9337.jpg)

ヘッドホンスタンドは[吉川優品のハンガーにもスタンドにもなるやつ](https://www.amazon.co.jp/gp/product/B07RHJ1QCK/)。

### 机

[かなでもののパイン](https://kanademono.design/products/tt-k04) に [X 字の脚](https://kanademono.design/collections/table-legs/products/x-k11) を合わせたもの。足には [マグネットのケーブルクリップ](https://www.amazon.co.jp/cheero-CHE-306-SET-CLIP-%E4%B8%87%E8%83%BD%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97-%EF%BC%88%E5%85%A8%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%EF%BC%89/dp/B00I2JAJAW/) でまとめた type-c ケーブルやまれに使う骨伝導イヤホンなどをくっつけている。

[![Image from Gyazo](https://i.gyazo.com/40033b6fcf3851ea08be16b1e49f7ef8.jpg)](https://i.gyazo.com/40033b6fcf3851ea08be16b1e49f7ef8.jpg)

骨伝導イヤホンは [AfterShokz Aeropex](https://www.amazon.co.jp/gp/product/B07RRQ59JR/)。ただ椅子のヘッドレストに干渉して使い辛いのであまり活躍はしていない。

### その他

書籍を平積みしている。常に動かすものは雑に置いておけというポリシーがあるのでブックスタンドとかは考えていない。雑に管理しているからこそ雑に取り出せる（雑に扱えないと本は読まない）。対になるポリシーに使ったものは元の場所に戻せというのがある。

今は [HTML 解体新書](https://www.amazon.co.jp/gp/product/4862465277/) と [ブルーベリー本](https://www.amazon.co.jp/gp/product/4297127474/) を置いてある。

## 終わりに

コンセプト構成からここまでで大体 4 ヶ月くらいだったが、それより前から買い揃えていたものもあるので全体でみると 1 年くらいかかった。Thunderbolt ケーブルの差し替えが若干面倒ではあるが、全部差し替えるより 100 倍マシなので満足はできている。

次改善するとしたら引っ越したときくらいなのでしばらくはこれでいくと思います。
