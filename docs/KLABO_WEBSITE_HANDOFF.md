# K-Labo 事業サイト構築 引き継ぎドキュメント

**作成日**: 2026-02-11
**目的**: 新リポジトリで K-Labo 事業紹介・宣伝サイトを構築するために必要な全情報を引き継ぐ

---

## 1. 背景と目的

### なぜ新サイトが必要か

- **事業用口座の申請中** — 銀行に提出する「具体的な業務URL」が必要
- **Stripe申請時に使用したURL `app.klabo.work` は廃止済み** — 現在は `klabo.work` ドメインに統一
- **今後の宣伝ページ** としても正式に整備していく必要がある

### 現在の状況

| 項目 | 状態 |
|------|------|
| `app.klabo.work` | **廃止済み**（使用していない） |
| `klabo.work/transcription/` | SaaSアプリ本番環境（稼働中） |
| `klabo.work/` (ルート) | **未使用** ← ここに事業サイトを設置する |

---

## 2. ドメイン・ホスティング情報

### ドメイン

| ドメイン | 用途 | 状態 |
|---------|------|------|
| `klabo.work` | 事業メインドメイン | さくらレンタルサーバーで運用中 |
| `felddorf.sakura.ne.jp` | さくらの初期ドメイン（開発環境用） | 稼働中 |
| `app.klabo.work` | 旧Stripe申請用（サブドメイン） | **廃止・未使用** |

### ホスティング

- **サーバー**: さくらレンタルサーバー（共有ホスティング）
- **OS**: FreeBSD ベース
- **Web Server**: Apache（mod_rewrite, mod_headers, mod_expires, mod_deflate 利用可能）
- **PHP**: 8.0+
- **SSH接続**: `ssh felddorf@felddorf.sakura.ne.jp`
- **SSH パスワード**: プロジェクトルートの `.env` ファイル内 `SSH_PASSWORD` を参照

### サーバーディレクトリ構造

```
/home/felddorf/www/
├── klabo.work/                          ← klabo.work ドメインのドキュメントルート
│   ├── transcription/                   ← SaaSアプリ本番環境（既存・触らない）
│   │   ├── index.html                   ← Vue.js SPA
│   │   ├── admin/                       ← Admin Portal
│   │   ├── api -> ../../medical_record_transcription/api-versions/ci-stable-xxx
│   │   ├── assets/
│   │   └── .htaccess                    ← SaaSアプリ用（既存）
│   └── (ここに事業サイトを設置)          ← index.html 等を配置
│       └── .htaccess                    ← 事業サイト用（新規作成が必要）
│
├── medical_record_transcription/        ← 開発環境（felddorf.sakura.ne.jp ドメイン）
│   ├── dev/latest/                      ← 開発版フロントエンド
│   ├── stable/latest/                   ← 安定版フロントエンド
│   ├── api-versions/                    ← APIバージョン管理
│   ├── vendor/                          ← PHP依存ライブラリ（共有）
│   └── .env                             ← 環境変数（共有）
│
└── felddorf.sakura.ne.jp/              ← 初期ドメインのドキュメントルート
```

### 重要: ディレクトリ配置の注意

- `klabo.work/` 直下が `klabo.work` ドメインのドキュメントルート
- `klabo.work/transcription/` は既存SaaSアプリ — **絶対に上書き・削除しないこと**
- 事業サイトは `klabo.work/` 直下の `index.html` 等として配置する
- `klabo.work/transcription/` への影響を避けるため、`.htaccess` の `RewriteRule` に注意

---

## 3. 現在の URL 構成

| URL | 用途 | 状態 |
|-----|------|------|
| `https://klabo.work/` | **事業紹介サイト（新規作成対象）** | 未設置 |
| `https://klabo.work/transcription/` | SaaSアプリ（Main App） | 稼働中 |
| `https://klabo.work/transcription/admin/` | Admin Portal | 稼働中 |
| `https://klabo.work/transcription/api/` | API | 稼働中 |

### 想定する事業サイトのURL設計

```
https://klabo.work/                     → トップページ（事業概要）
https://klabo.work/#features            → 機能紹介
https://klabo.work/#pricing             → 料金プラン
https://klabo.work/#terms               → 利用規約
https://klabo.work/#privacy             → プライバシーポリシー
https://klabo.work/#contact             → お問い合わせ
https://klabo.work/#tokushoho           → 特定商取引法に基づく表記
https://klabo.work/transcription/       → アプリへのリンク（既存）
```

---

## 4. 事業者情報（銀行・Stripe申請用）

以下の情報は既存のランディングページ（`landing.html`）から抽出。

### 特定商取引法に基づく表記

| 項目 | 内容 |
|------|------|
| 事業者名 | K-Labo |
| 運営責任者 | 野村 契 |
| 所在地 | 請求があった場合には遅滞なく開示 |
| 連絡先 | support@klabo.work |
| 支払方法 | クレジットカード（Stripe決済） |
| サービス提供時期 | 契約成立後即時 |

### サービス概要

- **サービス名**: K-Labo 医療記録作成アプリ
- **概要**: 音声・画像から診療録を自動生成する医療機関向けSaaSサービス
- **主な機能**:
  - 音声認識による文字起こし（Whisper API）
  - AI診療録自動生成（GPT）
  - QRコード連携による電子カルテ統合
  - 職種別プロンプト対応（医師・看護師・栄養士等）
  - 組織管理・ユーザー招待機能

### 料金プラン（現行）

| プラン名 | 月額（税込） | 対象 |
|---------|------------|------|
| クリニック標準 | ¥5,000 | 小規模クリニック・基本機能 |
| クリニックプレミアム | ¥10,000 | カスタムプロンプト・録音時間延長 |
| 中規模病院 | ¥15,000 | 複数ユーザー・高度なカスタマイズ |

### 利用規約・プライバシーポリシー・返金ポリシー

既存のランディングページに全文が含まれている。内容は以下のファイルを参照：

**ファイルパス**: `vue-app/public/landing.html` （旧リポジトリ）

含まれるセクション:
- 利用規約（第1条〜第5条）
- プライバシーポリシー（収集・利用目的・第三者提供・安全管理）
- 返金ポリシー（解約・日割り返金・返金条件・手続き）

---

## 5. さくらレンタルサーバー デプロイ方法

### SSH接続

```bash
ssh felddorf@felddorf.sakura.ne.jp
# パスワード: プロジェクトルート .env の SSH_PASSWORD を参照
```

### ファイルアップロード（scp）

```bash
# 単一ファイル
scp index.html felddorf@felddorf.sakura.ne.jp:/home/felddorf/www/klabo.work/

# ディレクトリごと
scp -r dist/* felddorf@felddorf.sakura.ne.jp:/home/felddorf/www/klabo.work/
```

### rsync（推奨）

```bash
# --exclude で既存の transcription/ を保護
rsync -avz --delete \
  --exclude 'transcription/' \
  dist/ \
  felddorf@felddorf.sakura.ne.jp:/home/felddorf/www/klabo.work/
```

**注意**: `--exclude 'transcription/'` は**必須**。SaaSアプリを誤って削除しないため。

### .htaccess の注意点

`klabo.work/` ルートに `.htaccess` を配置する場合、`transcription/` サブディレクトリへのリクエストを干渉しないこと。

```apache
# klabo.work/ ルートの .htaccess 例
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # HTTPS強制
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # /transcription/ は既存SaaSアプリに任せる（触らない）
    RewriteRule ^transcription(/|$) - [L]

    # 静的ファイルが存在する場合はそのまま返す
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # それ以外は index.html へ（SPAの場合）
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

### SSL証明書

- さくらレンタルサーバーの無料SSL（Let's Encrypt）を使用中
- `klabo.work` は既にSSL設定済み

---

## 6. Stripe ダッシュボード更新が必要

### 現在の設定（要更新）

| 項目 | 現在の値 | 更新後 |
|------|---------|--------|
| ビジネス Webサイト | `https://app.klabo.work` | `https://klabo.work/` |
| Webhook URL | `https://klabo.work/transcription/api/stripe/webhooks.php` | **変更不要** |

### 更新手順

1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. **Settings** → **Business settings** → **Public details**
3. **Website** を `https://klabo.work/` に変更
4. 保存

### Stripe決済で使用中の公開キー（参考）

```
Publishable Key: pk_live_51S2kNGGauZzEvuG9GTF555osjTBgSes3QZHkcycqf13bVqOdOxEno8R2hZZqw3o67cO5Ff8CaMVStc6wOWGNW3cY00tbSXmp2i
```

---

## 7. 旧リポジトリでのクリーンアップ作業

新サイトが `klabo.work/` にデプロイされた後、旧リポジトリで以下を実施する。

### 7-1. landing.html の削除

以下の2ファイルを削除：

```
vue-app/public/landing.html      ← ビルド時にdistにコピーされる
stable/landing.html              ← 直接配置されたコピー
```

**注意**: これらは SaaSアプリのビルドに含まれる `public/` ディレクトリ内にあるため、新サイトが稼働してから削除すること。

### 7-2. サーバー上の landing.html 削除

```bash
ssh felddorf@felddorf.sakura.ne.jp
rm -f /home/felddorf/www/klabo.work/transcription/landing.html
rm -f /home/felddorf/www/medical_record_transcription/dev/latest/landing.html
rm -f /home/felddorf/www/medical_record_transcription/stable/latest/landing.html
```

---

## 8. 技術選定の推奨

### 最速アプローチ（口座申請の緊急度が高い場合）

- **シンプルHTML/CSS** — 1ページで完結、ビルド不要、即デプロイ可能
- 既存の `landing.html` の内容をベースに、デザインを改善するだけで最速

### 将来的な拡張を見据える場合

- **Astro** — 静的サイト生成、Markdown対応、将来ブログ追加しやすい
- **Hugo** — 高速ビルド、テーマ豊富、Markdown中心

### 不要（オーバーキル）

- Next.js / Nuxt — SaaSアプリではないため不要
- WordPress — メンテナンスコストが高い

### デプロイ方式

GitHub Actions で自動デプロイも可能だが、静的サイトなら手動 `rsync` で十分。
CI/CDを組む場合は、旧リポジトリの `.github/workflows/ci-unified.yml` を参考にできる。

GitHub Actions用のSecretsは旧リポジトリと共有可能（同じサーバー）:
- `SSH_HOST`: `felddorf.sakura.ne.jp`
- `SSH_USER`: `felddorf`
- `SSH_PASSWORD`: `.env` ファイル参照
- デプロイ先: `/home/felddorf/www/klabo.work/`

---

## 9. サイトに含めるべきコンテンツ（銀行口座申請対応）

銀行の事業用口座審査では、以下が確認される：

1. **事業内容の説明** — どんなサービスか明確に
2. **料金体系** — 収益モデルの証明
3. **特定商取引法に基づく表記** — 法的要件
4. **利用規約** — サービスの契約条件
5. **プライバシーポリシー** — 個人情報の取扱い
6. **問い合わせ先** — 連絡手段の存在
7. **実際のサービスへのリンク** — `https://klabo.work/transcription/` への導線

### コンテンツの優先度

| 優先度 | コンテンツ | 理由 |
|--------|----------|------|
| **P0（必須）** | サービス概要・機能紹介 | 事業内容の説明 |
| **P0（必須）** | 料金プラン | 収益モデル |
| **P0（必須）** | 特定商取引法に基づく表記 | 法的義務 |
| **P0（必須）** | プライバシーポリシー | 法的義務 |
| **P0（必須）** | 利用規約 | 契約条件 |
| **P1（推奨）** | お問い合わせフォーム/メール | 信頼性 |
| **P1（推奨）** | アプリへのリンク・デモ画面 | 実在するサービスの証明 |
| **P2（将来）** | ブログ・お知らせ | SEO・マーケティング |
| **P2（将来）** | 導入事例 | 営業資料 |

---

## 10. 既存ランディングページ全文

以下に既存の `landing.html` の全テキストコンテンツを転記する。新サイト作成時のベーステキストとして使用可能。

### サービス概要
> K-Laboは、音声・画像から診療録を自動生成する医療機関向けSaaSサービスです。AI技術を活用し、診療記録作成業務を効率化します。

### 主な機能
- 音声認識による文字起こし
- AI診療録自動生成
- QRコード連携による電子カルテ統合
- 職種別プロンプト対応（医師・看護師・栄養士等）
- 組織管理・ユーザー招待機能

### 利用規約

**第1条（適用）**
本規約は、K-Labo（以下「当社」）が提供する医療記録作成SaaSサービス（以下「本サービス」）の利用条件を定めるものです。利用者は、本規約に同意の上、本サービスを利用するものとします。

**第2条（利用登録）**
本サービスの利用を希望する者は、当社所定の方法により利用登録を行うものとします。当社は、利用登録の申込みを承諾しない場合があります。

**第3条（禁止事項）**
利用者は、本サービスの利用にあたり、以下の行為を行ってはならないものとします。
- 法令または公序良俗に違反する行為
- 犯罪行為に関連する行為
- 当社のサーバーまたはネットワークの機能を破壊・妨害する行為
- 当社のサービスの運営を妨害するおそれのある行為
- 他の利用者に関する個人情報等を収集・蓄積する行為
- 不正アクセスまたは不正アクセスを試みる行為

**第4条（本サービスの提供の停止等）**
当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
- 本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
- 地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
- コンピュータまたは通信回線等が事故により停止した場合

**第5条（利用制限および登録抹消）**
当社は、利用者が以下のいずれかに該当する場合には、事前の通知なく、利用者に対して、本サービスの全部もしくは一部の利用を制限し、または利用者としての登録を抹消することができるものとします。
- 本規約のいずれかの条項に違反した場合
- 登録事項に虚偽の事実があることが判明した場合
- 料金等の支払債務の不履行があった場合

### プライバシーポリシー

**個人情報の収集**
当社は、本サービスの提供にあたり、以下の個人情報を収集します。
- 氏名、メールアドレス、電話番号
- 医療機関名、部署、役職
- 決済情報（クレジットカード情報はStripeが管理）
- サービス利用履歴

**個人情報の利用目的**
- 本サービスの提供・運営のため
- 利用者からのお問い合わせに対応するため
- 利用規約に違反した利用者への対応のため
- 本サービスの改善・新サービス開発のため

**個人情報の第三者提供**
当社は、以下の場合を除き、個人情報を第三者に提供しません。
- 利用者の同意がある場合
- 法令に基づく場合
- 決済処理のためStripeに提供する場合
- 認証処理のためClerkに提供する場合

**個人情報の安全管理**
当社は、個人情報の正確性および安全性確保のため、セキュリティ対策を実施し、個人情報への不正アクセス、紛失、破壊、改ざん、漏洩等を防止します。

### 返金ポリシー

**月額サブスクリプションの解約**
月額サブスクリプションは、いつでも解約が可能です。解約は次回請求日の前日までに行ってください。解約手続き完了後、次回請求日以降の課金は発生しません。

**日割り返金について**
月途中での解約の場合、日割り計算による返金は行いません。契約期間満了日までサービスをご利用いただけます。

**返金が可能な場合**
以下の場合に限り、返金対応を行います。
- サービス障害により、連続して7日間以上サービスが利用できなかった場合
- 当社の重大な過失により、サービスが正常に提供されなかった場合
- 二重請求等、当社の請求ミスがあった場合

**返金手続き**
返金を希望される場合は、support@klabo.work までご連絡ください。返金は、Stripeを通じて元のクレジットカードに返金されます（処理まで5-10営業日）。

---

## 付録: GitHub Actions CI/CD サンプル（参考）

旧リポジトリの `ci-unified.yml` から抽出した klabo.work デプロイ部分：

```yaml
# klabo.work へのデプロイ（参考）
- name: Deploy to klabo.work
  run: |
    sshpass -p "${{ secrets.SSH_PASSWORD }}" rsync -avz --delete \
      -e "ssh -o StrictHostKeyChecking=no" \
      vue-app/dist/ \
      ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/home/felddorf/www/klabo.work/transcription/
```

新しい事業サイト用に改変する場合：

```yaml
# 事業サイト用デプロイ（案）
- name: Deploy corporate site to klabo.work
  run: |
    sshpass -p "${{ secrets.SSH_PASSWORD }}" rsync -avz --delete \
      --exclude 'transcription/' \
      -e "ssh -o StrictHostKeyChecking=no" \
      dist/ \
      ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/home/felddorf/www/klabo.work/
```

**注意**: `--exclude 'transcription/'` で既存SaaSアプリを保護すること。
