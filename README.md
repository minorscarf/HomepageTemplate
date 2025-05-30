# Node.js ホームページテンプレート

このプロジェクトは、Node.js と Express を使用して構築された静的ウェブサイトテンプレートです。

---

## 📂 テンプレートの使い方

このテンプレートを使って自分のサイトを作りたい場合は、以下の手順でフォークしてください。

### 🔧 フォーク手順

1. このページ右上の **[Fork]** ボタンをクリックして、自分のGitHubアカウントにコピーします  
2. コピーされた自分のリポジトリページに移動し、以下のコマンドでローカルにクローンします：  

```bash
git clone https://github.com/あなたのユーザー名/フォークしたリポジトリ名.git
```
```bash
cd フォークしたリポジトリ名  
```

## 🚀 セットアップ手順

### 📦 1. 必要なモジュールのインストール

以下のコマンドをプロジェクトのルートディレクトリで実行してください：

```bash
npm install
```
### ▶️ 2. サーバーの起動

以下のいずれかのコマンドでローカルサーバーを起動できます：

```bash
npm start
```

または
```bash
node server.js
```

### 🌐 3. ブラウザで確認

起動後、以下のURLにアクセスしてください：
```bash
http://localhost:3000
```
---

## 🖼 画像フォルダの使い方

このプロジェクトでは、以下の5種類の画像フォルダがあらかじめ用意されています。  
それぞれのフォルダに画像ファイルを追加するだけで、**自動的にWebサイトに反映される仕組み**になっています。

| フォルダ名         | 用途                                |
|--------------------|-------------------------------------|
| `Background/`      | 全体の背景画像として使用 |
| `features/`        | 特徴（Features）セクションで表示される画像 |
| `main/`            | 画像が切り替わる部分で表示される画像 |
| `NoiseTexture/`    | 画像切り替え時の変わり方として読みとられるノイズテクスチャ |
| `portfolio/`       | ポートフォリオセクションで表示される画像 |

> これらのフォルダには `.gitkeep` が入っており、空の状態でもGit管理されるようになっています  
> 特に用途はないので１枚目の画像を入れたら削除してください  
> 実際に使用する際は、対応するフォルダに画像ファイル（`.jpg`, `.png`, `.webp` など）を追加してください。

---

---

## 🛠 画像を使った新しい機能・セクションの追加方法

このプロジェクトでは、特定の画像フォルダ（例: `main`, `features`, `portfolio` など）にある画像をサーバー経由で読み込み、Webページ上に自動で表示する仕組みになっています。

この仕組みは `server.js` の以下の関数で構成されています：

```js
function serveImagesFrom(folderName) {
  return (req, res) => {
    const dirPath = path.join(__dirname, `Images/${folderName}`);
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return res.status(500).json({ error: `${folderName}画像の読み込みに失敗しました` });
      }
      const images = files.filter(file =>
        /\.(png|jpe?g|webp|gif)$/i.test(file)
      ).map(file => `/Images/${folderName}/${file}`);
      res.json(images);
    });
  };
}
```

### 画像を使った新しい機能を追加する手順
#### 1. Images/ 配下に画像フォルダを作成する
```
Images/  
└── NewImages/  
    ├── Image1.png  
    └── Image2.jpg  
```

#### 2. server.js にAPIエンドポイントを追加
```
app.get('/api/team', serveImagesFrom('team'));
```
#### 3. フロントエンド側から画像一覧を取得

たとえば JavaScript 側で次のように fetch：
```
fetch('/api/team')
  .then(res => res.json())
  .then(images => {
    // 画像URLの配列が返ってくる
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      document.getElementById('team-section').appendChild(img);
    });
  });
```

#### 4. HTMLに表示エリアを用意
```
<section id="team-section">
  <h2>チーム紹介</h2>
  <!-- JSで画像が挿入されます -->
</section>
```
🔁 応用例
```
    ギャラリーセクションを追加

    スポンサー一覧の画像を順番に表示

    イベント告知画像を順番に表示
```
🔐 注意
フォルダ名とエンドポイント名は必ず一致させてください（例: /api/portfolio → Images/portfolio/）  
画像のファイル名や拡張子には半角英数字を使うことを推奨します
