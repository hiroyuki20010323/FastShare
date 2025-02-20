# FastShare
| | |
|:---:|:---:|
| <img width="423" alt="Image" src="https://github.com/user-attachments/assets/27066c04-96f4-41e1-bbdb-5cdf0137ea27" /> | <img width="405" alt="Image" src="https://github.com/user-attachments/assets/d766c8d6-4609-4ead-9e9d-ceeb3cc69739" /> |


## 概要
FastShareは、グループを作成し、メンバー同士でタスク(買い物や家事)を共有できるアプリです。

## 作成の経緯・詳細
お風呂掃除中に洗剤が切れていることに気づき、外出中の家族に購入を依頼しようとしました。ところが、複数の家族にそれぞれ連絡するのは面倒ですし、一人が「買ってくるよ」と承諾した場合には、もう一方に「大丈夫になった」と連絡して断る必要があります。

さらに、買い物が複数アイテムにわたる場合には、この「誰が何を買うのか」を逐一調整する手間が増えてしまいます。また、「さっき買い物に行ったのに、必要なものを伝えそびれてしまった」ということも起こりがちで、必要な情報を事前に整理・共有しておけば良かったと後悔する場面もあります。

こうした課題を解決するために、「必要なもの」を一元的に共有できる仕組みがあれば便利だと考えました。全員がアクセスできる場所に、買うべきアイテムのリストをまとめておけば、それぞれが外出先で確認し、ついでに購入することができます。これにより、

・個別に連絡する手間が省ける<br>
・重複購入を防止できる<br>
・「あ、伝え忘れてた！」といったミスを減らせる

ただし、既存のLINEグループなどを利用すると、ほかのトークで埋もれてしまったり、情報が整理されにくいといったストレスが生じたりする場合があります。そこで、ユーザー体験（UX）を最適化した専用のアプリを作成することで、ストレスなく「必要なもの」を管理・共有できるようにしました。

このように、家族や仲間内で買い物を共有・管理できる仕組みを整えることで、重複購入や連絡漏れの問題を解消し、時間をより有意義に使えるようになります。

FastShareは、こうした日常のちょっとした煩わしさをなくすためのソリューションとして開発したものです。

## URL
URL: https://fastshare.jp/login<br>
※現状ルートURLは何も設定しておらず、白飛びしてしまいますので、/login または　/signupで検索してください。

## 機能一覧
* サインアップ<br>
* ログイン・ログアウト(google、パスワード・email)<br>
* プロフィール編集<br>
* グループ作成、編集、削除

2025-1/24時点
## 実装予定機能
  1. タスクCRUD（実装中...）
  2. グループ招待
  3. Spinnerの実装
  4. Snackbarの作成
## 使用技術
- フロントエンド
  - React
  - TypeScript
  - Material UI
  - Firebase Authentication
  - Vite
- バックエンド
  - Node.js 
  - Express
  - Prisma
  - TypeScript
  - Firebase Admin SDK
  - Docker / Docker Compose
  - Multer-S3（画像アップロード）
- インフラストラクチャ
  - AWS
    - フロントエンド: S3, CloudFront
    - バックエンド: ECS (Fargate), ECR, S3
    - データベース: RDS (MySQL)
  - CI/CD
    - GitHub Actions (フロントエンド)
    - AWS Copilot CLI (バックエンド)
- 開発ツール
  - Git/GitHub
  - Figma

## UIプロトタイプ
[プロトタイプ](  https://www.figma.com/proto/owXvBVTldegJC01y0D0bce/%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA%E8%A8%AD%E8%A8%88?node-id=10-4&t=u7yScyvT6wpmj2fp-1)<br>

## ER図
```mermaid
erDiagram
    users {
        String id PK
        String user_name
        String icon_url
        DateTime created_at
        DateTime updated_at
    }
    groups {
        Int id PK
        String group_name
        String group_description
        String group_icon
        DateTime created_at
        DateTime updated_at
    }
    participations {
        String id PK
        String user_id FK
        Int group_id FK
        Boolean is_active
        DateTime created_at
        DateTime updated_at
    }
    calendars {
        Int id PK
        DateTime date
        DateTime created_at
        DateTime updated_at
    }

    request {
      Int id
      Int participation_id FK
      DateTime created_at
      DateTime updated_at
    }

    contractor {
      Int id
      Int participation_id FK
      DateTime created_at
      DateTime updated_at
    }

    tasks {
        Int id PK
        String task_title
        String task_detail
        String task_image_url
        DateTime period
        Int contractor_id FK
        Int request_id FK
        Int calendar_id FK
        DateTime created_at
        DateTime updated_at
    }

%% 既存のリレーションシップ
    users ||--o{ participations : "ユーザーは複数のグループに参加可能"
    groups ||--o{ participations : "グループは複数の参加者を持つ"
    calendars ||--o{ tasks : "1つの日付に複数のタスクを登録可能"
    participations ||--o{ request : "グループ参加者がタスクを依頼"
    participations ||--o{ contractor: "グループ参加者がタスクを請負"
    request ||--||tasks: "タスクに割り当て"
    contractor ||--||tasks: "タスクに割り当て"


```
## インフラ構成
<img width="100%" alt="Image" src="https://github.com/user-attachments/assets/a3e9d3d1-9be3-40b5-9867-54080844004c" />



 

