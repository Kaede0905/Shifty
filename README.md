# Shifty

## 概要

Shiftyは、飲食店におけるシフト管理業務の効率化を目指して開発されたシフト管理アプリケーションです。
アルバイトのシフト確定までに3週間を要していたという店舗の現場課題を特定し、その業務プロセスをわずか1週間へと大幅に短縮することに成功しました。

## 特徴

* **現場主導の要件定義**: 単なる機能実装にとどまらず、現場のスタッフやマネージャーとのヒアリングを通じて「業務がなぜ遅れているのか」という根本的な課題を抽出しました。

* **効率化の実現**: 従来の煩雑なシフト調整プロセスをデジタル化・最適化し、管理者の事務負担を大幅に削減します。

* **データベース設計の刷新**: 当初は小規模な設計でしたが、より汎用性を高めるためにリレーション構造を多対多のモデルへ根底から見直しました。これと共にデプロイ時にデータベースをSQLiteからPostgreSQLへと移行しています。

## システムアーキテクチャ

本プロジェクトはRenderのWebサービス上で、Railsがフロントエンド（React）を静的データとして配信し、`api/v1` エンドポイントを介してデータ通信を行う構成をとっています。

### システム構成図

```mermaid
graph TD
    subgraph "Render Web Service"
        React[React / TypeScript (in public/)] -->|API Request /api/v1/| Rails[Rails API Server]
        Rails --> Auth[Devise Auth]
        Rails --> Logic[Shift Generation/Validation]
    end
    
    subgraph "Data Layer"
        Logic --> DB[(Render PostgreSQL)]
    end
