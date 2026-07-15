Shifty
概要
Shiftyは、飲食店におけるシフト管理業務の効率化を目指して開発されたシフト管理アプリケーションです。
アルバイトのシフト確定までに3週間を要していたという店舗の現場課題を特定し、その業務プロセスをわずか1週間へと大幅に短縮することに成功しました。

特徴
現場主導の要件定義: 単なる機能実装にとどまらず、現場のスタッフやマネージャーとのヒアリングを通じて「業務がなぜ遅れているのか」という根本的な課題を抽出しました。

効率化の実現: 従来の煩雑なシフト調整プロセスをデジタル化・最適化し、管理者の事務負担を大幅に削減します。

アーキテクチャと技術的工夫
本プロジェクトでは、将来的な拡張性と安定性を考慮した設計を行っています。

データベース設計の刷新: 当初は小規模な設計でしたが、より汎用性を高めるためにリレーション構造を多対多のモデルへ根底から見直しました。これに伴い、データベースをSQLiteからPostgreSQLへと移行しています。

システム構成図:
```mermaid
graph TD
    subgraph "Client Side"
        React[React / TypeScript]
    end

    subgraph "Server Side"
        Rails[Ruby on Rails API]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL)]
    end

    React -->|API Request| Rails
    Rails -->|Read/Write| PostgreSQL


利用技術:

Frontend: React, TypeScript

Backend: Ruby on Rails

Infrastructure: AWS

Database: PostgreSQL

開発のポイント
このプロジェクトで最もこだわったのは、「技術的な正解を出すこと」ではなく「ユーザーが直面している課題を解決すること」です。
技術選定においても、単に新しいものを使うのではなく、現場のオペレーションにどのようにフィットさせるかを重視して設計を行いました。
