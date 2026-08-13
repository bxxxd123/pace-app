# Pace — AI 陪伴式睡眠管理原型 🐾

以陪伴寵物（預設名字「咘咘」，可在設定裡改名）為核心的睡眠管理 App 高擬真互動原型。
依據《Pace_睡眠管理_規劃書》製作，涵蓋全部 11 個畫面與四個分支情境。

## 啟動

```bash
cd pace
npm install
npm run dev        # 開發預覽（瀏覽器開 http://localhost:5173）
npm run build      # 產出靜態檔到 dist/
npx vitest run     # 跑 48 個邏輯層單元測試
```

## 展示面板（Demo 必看）

**連點狀態列左上角的時鐘 3 下**，開啟隱藏展示面板：

| 功能 | 說明 |
|---|---|
| 情境切換 | 覆寫真實時間：睡前（夜）/ 起床（晨）/ 半夜 / 白天，首頁的陪伴寵物姿態、問候語、配色、入口都會跟著變 |
| 推進提醒 | 模擬「睡前忽略記錄」：L1 溫和邀請 → L2 輕提醒 → L3 降級關心（設定頁切「溫柔一點」時 L2 直接變關心語氣） |
| 賴床 +2hr | 起床記錄預設時間晚於常態 2 小時，完成文案變接納式「今天也還好，慢慢來」 |
| 夢境補記 | 首頁出現不打擾的補記小圓點 |
| 載入三週資料 | 灌入含「週三晚睡」模式的擬真資料，讓紀錄頁的洞察卡有內容 |
| 全部重置 | 清空資料、回到 Onboarding |

## 規劃書對照

| 規劃書項目 | 實作位置 |
|---|---|
| O1/O2 Onboarding（含姓名題＋4 題） | `src/screens/Onboarding.tsx`，首次使用自動開啟 |
| T1 首頁（時段感知） | `src/screens/Home.tsx`，含日期天氣列、evening 雙按鈕、記錄後的建議卡 |
| F1 睡前記錄（<15 秒） | `src/screens/Bedtime.tsx`，AI 建議時間一鍵帶入，可重新開啟修改 |
| F2 起床記錄 | `src/screens/Wake.tsx`，表情改用陪伴寵物插畫＋起訖微調＋睡眠摘要卡 |
| F3 AI 陪伴對話 | `src/screens/Chat.tsx`，規則式回應庫＋輸入中擬真延遲 |
| AI 分層提醒 | `src/engine/reminder.ts` ＋ 首頁文字卡 |
| F4/F5 夢境記錄與標籤 | `src/screens/Dream.tsx`，語音模擬優先、標籤可編輯、儲存後彈出通知（2 秒自動消失） |
| T2 紀錄頁 | `src/screens/Records.tsx`，波浪線標實際日期＋月相＋洞察卡；點波浪圖卡進入 `RecordsDetail.tsx` 看每日詳細數字 |
| T3 設定 | `src/screens/Settings.tsx`，語氣強度會實際影響提醒文案；可改陪伴寵物名字與使用者名字 |
| 四個分支情境 | 忽略提醒/半夜醒來/賴床/趕時間補記，皆可由展示面板觸發 |

## 技術備註

- Vite + React + TypeScript + zustand；資料存 localStorage（`pace:state`），不可用時退化為記憶體模式
- AI 全部為規則式模擬（`src/engine/`），介面已抽象化，未來可替換為真 API
- 陪伴寵物插畫改用手繪 SVG 素材（`src/assets/dog/`，透過 `src/components/Pet.tsx` 依姿態切換），名字預設「咘咘」，可在設定裡修改
- 視覺 token 延伸自品牌四色（`src/styles/tokens.css`）：主色 `#214C9F`、湖水藍 `#5BC2D6`、薰衣草紫 `#BFA6D4`、米白 `#F7F9F9`
- 字型：jf 粉圓體（open 粉圓，OFL 授權）
- 語氣原則遵守規劃書第 7 節：不評分、不催促、介面永不出現數字分數；紀錄頁預設仍以隱喻呈現，實際數字藏在下一層的紀錄細節頁
