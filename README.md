# Interactive Sculpture

Three.jsとMediaPipe Poseを用いて制作している、身体動作に反応するインタラクティブなバーチャル彫刻作品です。

## Overview

暗闇と静寂に包まれた仮想空間の中で、鑑賞者の存在や身体の動きによって彫刻が徐々に反応するインスタレーション作品を目指しています。

通常モードでは、鑑賞者が仮想空間内で彫刻へ近づくことで、発光・回転・パーティクル・音などの変化が発生します。

Webカメラモードでは、MediaPipe Poseによって鑑賞者の身体動作を取得し、腕の広がりや高さに応じて彫刻の形や光が変化します。

## Concept

**「静寂の中で、鑑賞者の存在によって目覚める彫刻」**

何もしていない状態では暗く静かな彫刻が、人が近づいたり身体を動かしたりすることで徐々に目覚めていく体験を表現しています。

ゲームのような明確な目標やスコアを設けるのではなく、鑑賞者自身の動きと空間の変化を楽しむインタラクティブアート作品として制作しています。

## Features

### Normal Mode

* WASDキーによる一人称視点での移動
* マウスによる視点操作
* 彫刻との距離に応じた発光
* 彫刻の回転
* パーティクル表現
* 距離に応じたサウンドの変化

### Webcam Mode

Webカメラ映像をMediaPipe Poseで解析し、身体動作をリアルタイムで取得します。

* 両腕を横に広げる

  * Ringが拡大
  * Ringの回転が変化
  * Particleの広がる領域が拡大

* 両腕を上げる

  * 彫刻の発光が強くなる
  * Ringの発光が強くなる
  * Particleが明るくなる

身体動作を単純なON/OFFとして扱うのではなく、動きの大きさを0〜1の連続値として取得し、彫刻の変化へ反映しています。

## Technologies

* JavaScript
* Three.js
* MediaPipe Tasks Vision
* MediaPipe Pose Landmarker
* Vite
* WebGL
* Web Camera API

## Project Structure

```text
.
├── public/
│   └── sounds/
├── src/
│   ├── main.js
│   ├── pose.js
│   ├── webcam.js
│   └── style.css
├── index.html
├── package.json
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

ブラウザで表示されたローカルURLへアクセスしてください。

## Controls

### Normal Mode

| Input | Action         |
| ----- | -------------- |
| W     | 前進             |
| S     | 後退             |
| A     | 左移動            |
| D     | 右移動            |
| Mouse | 視点操作           |
| Esc   | Pointer Lock解除 |

### Webcam Mode

画面左上の「Webカメラモード」ボタンから切り替えます。

ブラウザからカメラ使用の許可を求められた場合は、使用を許可してください。

カメラに上半身と両腕が映る程度まで離れると、Pose Detectionが安定しやすくなります。

## Current Status

現在開発中です。

実装済み：

* Three.jsによる3D空間
* 抽象彫刻
* 一人称視点での移動
* 距離によるインタラクション
* Particle表現
* Positional Audio
* Webカメラモード
* MediaPipe Poseによる人体検出
* 腕の広がりによるRing / Particle操作
* 腕の高さによる発光操作

今後、身体動作とサウンドの連動や、鑑賞者が空間から離れた際に彫刻が徐々に静寂へ戻る演出などを追加する予定です。
