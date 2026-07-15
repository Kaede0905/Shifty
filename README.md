# Shifty

## 概要

Shiftyは、飲食店におけるシフト管理業務の効率化を目指して開発されたシフト管理アプリケーションです。
アルバイトのシフト確定までに3週間を要していたという現場特有の課題を特定し、業務プロセスのデジタル化と最適化により、わずか1週間へと大幅に短縮することに成功しました。

### 構成概要

* **Hosting**: Render (Web Service)

* **Database**: PostgreSQL (Render Database)


### システム構成図

```mermaid
graph TD
    Client[React / TypeScript] -->|API Request| API[Rails API Server]
    
    subgraph "Server Side (Render)"
        API --> Auth[Devise Auth]
        API --> Logic[Shift Generation/Validation]
        API --> AC[ActionCable / WebSockets]
    end
    
    subgraph "Background & Cache"
        AC <--> Redis[(Render Redis)]
        Logic --> Sidekiq[Sidekiq / Async Tasks]
    end
    
    subgraph "Data Layer"
        Logic --> DB[(Render PostgreSQL)]
    end
