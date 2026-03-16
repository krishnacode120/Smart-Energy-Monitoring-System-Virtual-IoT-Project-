<div align="center">

<img src="https://img.shields.io/badge/⚡-EnergiSense-00F2FF?style=for-the-badge&labelColor=0B0E14&color=00F2FF" alt="EnergiSense" height="40"/>

# EnergiSense — Virtual IoT Smart Energy Monitoring System

**A production-grade, hardware-free smart home energy dashboard that simulates IoT appliances,
tracks electricity consumption in real time, and delivers actionable cost insights.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-00F2FF?style=flat-square&logo=vercel&logoColor=white&labelColor=0B0E14)](https://smart-energy-monitoring-system.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=0B0E14)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat-square&logo=javascript&logoColor=white&labelColor=0B0E14)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=flat-square&logo=chartdotjs&logoColor=white&labelColor=0B0E14)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square&labelColor=0B0E14)](LICENSE)

<br/>

> *No hardware. No sensors. Full IoT experience — entirely in the browser.*

<br/>

<!-- Replace with an actual screenshot of your dashboard -->
<!-- ![EnergiSense Dashboard](https://your-screenshot-url.png) -->

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Virtual Devices](#virtual-devices)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How the Simulation Works](#how-the-simulation-works)
- [Dashboard Pages](#dashboard-pages)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**EnergiSense** is a Virtual IoT Smart Energy Monitoring System built as a full-stack React web application. It simulates a network of household smart appliances — air conditioners, refrigerators, televisions, fans, lights, and more — and continuously tracks their electricity consumption without requiring any physical IoT hardware.

The project demonstrates real-world concepts including:

- IoT device simulation and state management
- Real-time energy data generation using JavaScript timers
- Interactive data visualization (area charts, bar charts, heat maps)
- Electricity cost estimation with a configurable rate
- Energy efficiency scoring and alert detection
- Responsive, glassmorphism-styled dark UI

This makes it an ideal **portfolio project** for developers interested in IoT, energy tech, smart home systems, or full-stack React development.

---

## Live Demo

**[→ Open EnergiSense on Vercel](https://smart-energy-monitoring-system.vercel.app/)**

The demo runs entirely in the browser. All device data is simulated — no backend or database connection is required to explore the full feature set.

---

## Key Features

### Real-Time Simulation Engine
- Ticks every 5 seconds to recalculate energy consumption across all active devices
- Accumulates kWh based on device wattage and elapsed runtime
- Mirrors real IoT data streams without requiring physical hardware

### Interactive Dashboard
- Hero metrics row: total energy today, live ₹ cost counter, and an animated circular load gauge
- 24-hour area chart with a glowing neon line and frosted-glass tooltips
- Quick device control grid — click any appliance card to toggle it on/off instantly

### Device Management
- Full device table with name, status badge, wattage, accumulated kWh, and a health indicator bar
- Neumorphic toggle switches per device
- Device-level wattage bar chart and load distribution heat map

### Electricity Cost Calculator
- Adjustable ₹/kWh rate slider (₹1–₹20)
- Instant recalculation of hourly, daily, monthly, and yearly cost projections
- Device-wise cost breakdown table

### Analytics & Trends
- Switch between 24-hour, 7-day, and 30-day consumption views
- Peak, average, and total kWh statistics per period
- Weekly overview bar chart with color-coded columns

### Energy Alerts
- Automatic detection of high load, critical overload, and efficiency wins
- Context-aware messages (e.g. "AC is running — highest single consumer")
- Alert severity levels: info, warning, and critical

### Efficiency Score
- Composite score (0–100) based on device health ratings
- Per-device health progress bars
- Color-coded ring gauge (green/amber/red thresholds)

### Energy Saving Tips
- Rotating tip feed in the header marquee and dedicated tips page
- 8 actionable recommendations covering HVAC, lighting, appliance habits, and scheduling

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                        │
│                                                             │
│  ┌───────────────┐    ┌──────────────────────────────────┐  │
│  │  React UI     │◄───│    Simulation Engine              │  │
│  │  (5 pages)    │    │  setInterval → 5s tick           │  │
│  │               │    │  kWh += (W/1000) × (5/3600)     │  │
│  │  Dashboard    │    │  State managed via useState       │  │
│  │  Devices      │    └──────────────────────────────────┘  │
│  │  Analytics    │                                           │
│  │  Billing      │    ┌──────────────────────────────────┐  │
│  │  Settings     │◄───│    Chart Engine (Canvas API)      │  │
│  └───────────────┘    │  Area, Bar, Sparkline, Gauge      │  │
│                        └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                    Deployed on Vercel
```

Because EnergiSense is a **frontend-only simulation**, all state lives in React. A backend + MongoDB layer can be added for persistence (see [Roadmap](#roadmap)).

---

## Virtual Devices

The simulation engine tracks 8 household appliances out of the box:

| Device | Icon | Wattage | Category | Default State |
|---|---|---|---|---|
| Air Conditioner | ❄️ | 1500 W | Cooling | ON |
| Refrigerator | 🧊 | 300 W | Cooling | ON |
| Television | 📺 | 120 W | Entertainment | ON |
| Ceiling Fan | 🌀 | 70 W | Cooling | ON |
| Smart Lights | 💡 | 20 W | Lighting | ON |
| Washing Machine | 🫧 | 500 W | Cleaning | OFF |
| Wi-Fi Router | 📡 | 15 W | Networking | ON |
| Microwave Oven | 📦 | 900 W | Cooking | OFF |

Each device tracks its **name, wattage, on/off state, accumulated kWh, and a health score (0–100)**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (Create React App) |
| Styling | Custom CSS-in-JS, Google Fonts (Syne + JetBrains Mono) |
| Charts | Custom Canvas API (Area, Bar, Sparkline) |
| Simulation | JavaScript `setInterval` timers |
| State Management | React `useState` + `useEffect` |
| Deployment | Vercel |
| Language | JavaScript (ES2023) |

> **Note:** The project is intentionally frontend-only to maximise portability and demonstrate that IoT-style systems can be prototyped without backend infrastructure.

---

## Project Structure

```
Smart-Energy-Monitoring-System-Virtual-IoT-Project-/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── AreaChart.jsx         # Custom canvas area chart with tooltip
│   │   ├── BarChart.jsx          # Vertical bar chart
│   │   ├── Sparkline.jsx         # Mini inline trend line
│   │   ├── GaugeRing.jsx         # SVG circular gauge
│   │   ├── HeatMap.jsx           # Energy hog horizontal bar map
│   │   └── EffScore.jsx          # Efficiency score ring + breakdown
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx     # Hero metrics, main chart, quick controls
│   │   ├── DevicesPage.jsx       # Full device table + analytics row
│   │   ├── AnalyticsPage.jsx     # Trend charts with 24h/7d/30d tabs
│   │   ├── BillingPage.jsx       # Cost calculator, device breakdown
│   │   └── SettingsPage.jsx      # Preferences, tips, system info
│   │
│   ├── data/
│   │   ├── devices.js            # Device definitions (watt, icon, category)
│   │   └── tips.js               # Energy saving tip strings
│   │
│   ├── utils/
│   │   ├── simulation.js         # kWh calculation helpers
│   │   ├── alerts.js             # Alert rule engine
│   │   └── formatters.js         # fmtKwh, fmtRs, fmtW helpers
│   │
│   ├── styles/
│   │   └── globals.css           # CSS variables, animations, base styles
│   │
│   ├── App.jsx                   # Root layout: sidebar + routing
│   └── index.js                  # React DOM entry point
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

```bash
node --version   # v18.x or higher
npm --version    # 9.x or higher
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/krishnacode120/Smart-Energy-Monitoring-System-Virtual-IoT-Project-.git

# 2. Navigate into the project
cd Smart-Energy-Monitoring-System-Virtual-IoT-Project-

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads on file changes.

### Production Build

```bash
npm run build
```

The optimised build is output to the `build/` folder, ready for static deployment.

### Running Tests

```bash
npm test
```

---

## How the Simulation Works

EnergiSense replaces physical IoT sensors with a **JavaScript timer-based simulation engine**.

### Energy Accumulation Formula

Every 5 seconds, for each device that is currently ON:

```
ΔkWh = (device_wattage / 1000) × (tick_interval_seconds / 3600)
```

For example, the Air Conditioner (1500 W) running for one 5-second tick contributes:

```
ΔkWh = (1500 / 1000) × (5 / 3600) = 0.00208 kWh
```

These deltas accumulate over the session, simulating real-world energy metering.

### Cost Calculation

```
cost = total_kWh × rate_per_kWh
```

The rate defaults to ₹8/kWh and is adjustable via the slider on the Dashboard and Billing pages. All cost projections (hourly, daily, monthly, yearly) update instantly.

### Alert Rules

The alert engine evaluates the following conditions on every tick:

| Condition | Severity |
|---|---|
| Active load > 2000 W | 🔴 Critical |
| Active load > 1500 W | 🟡 Warning |
| Air Conditioner is ON | 🟡 Warning |
| Total kWh today > 5 | 🟡 Warning |
| Active load < 200 W | 💚 Info (Efficiency win) |
| All devices OFF | ✅ OK |

### History Generation

24h, 7d, and 30d historical datasets are procedurally generated on mount using a seeded random function that models realistic peak (morning 7–9am, evening 6–10pm) and off-peak usage patterns.

---

## Dashboard Pages

### ⊞ Dashboard
The main view. Shows live energy metrics, the 24-hour consumption profile, a quick-toggle device grid, the alert feed, a rotating energy tip, and the cost calculator.

### ◈ Devices
A comprehensive device management table with per-device wattage, accumulated kWh, health bars, and toggle controls. Includes a load heat map, wattage bar chart, and the efficiency score ring.

### ⋈ Analytics
Switchable trend charts (24h / 7d / 30d) with peak, average, and total statistics. Includes a cost trend chart, device energy share heat map, and weekly bar overview.

### ◉ Billing
Monthly bill estimate, the ₹/kWh rate slider, device-wise cost breakdown with progress bars, and a 30-day cost trend chart.

### ⊙ Settings
System preferences (alerts toggle, auto-off simulation), the global rate control, system information panel, and the full tips library.

---

## API Reference

> EnergiSense is currently frontend-only. The API endpoints below are the **planned backend specification** for a future Node.js + Express + MongoDB integration.

### Devices

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/devices` | Return all device definitions and current state |
| `POST` | `/api/devices` | Add a new virtual device |
| `PUT` | `/api/devices/:id/status` | Toggle a device ON or OFF |
| `DELETE` | `/api/devices/:id` | Remove a device |

### Energy

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/energy/summary` | Total kWh, active load, device count |
| `GET` | `/api/energy/history?period=24h` | Historical usage data |
| `GET` | `/api/energy/device/:id` | Per-device energy history |

### Cost

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/energy/calculate-cost` | `{ kwh, rate }` → `{ cost }` |

### Example Response — `/api/energy/summary`

```json
{
  "total_kwh": 4.825,
  "active_load_watts": 2005,
  "active_devices": 5,
  "estimated_cost_inr": 38.60,
  "efficiency_score": 88,
  "timestamp": "2026-03-16T14:32:00Z"
}
```

---

## Deployment

### Deploying to Vercel (Recommended)

```bash
# Install the Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

Or connect your GitHub repository directly in the [Vercel dashboard](https://vercel.com/new) for automatic deployments on every push to `main`.

### Deploying to Netlify

```bash
npm run build
# Drag and drop the build/ folder into Netlify Drop
# or use the Netlify CLI: netlify deploy --prod --dir=build
```

### Environment Variables (for future backend)

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_DEFAULT_RATE=8
REACT_APP_TICK_INTERVAL_MS=5000
```

---

## Roadmap

- [x] Virtual IoT device simulation engine
- [x] Real-time kWh accumulation with 5-second ticks
- [x] Interactive dashboard with 5 pages
- [x] Cost calculator with configurable ₹/kWh rate
- [x] Alert detection engine
- [x] Efficiency scoring system
- [x] 24h / 7d / 30d analytics views
- [x] Deployed on Vercel
- [ ] Node.js + Express REST API backend
- [ ] MongoDB persistence for device state and history
- [ ] User authentication (JWT)
- [ ] AI-based energy prediction (regression model)
- [ ] WebSocket support for true real-time streaming
- [ ] Daily PDF report generation
- [ ] Dark / light theme toggle
- [ ] Multi-user household profiles
- [ ] Carbon footprint calculator

---

## Contributing

Contributions are welcome! Here's how to get involved:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Smart-Energy-Monitoring-System-Virtual-IoT-Project-.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git commit -m "feat: add WebSocket real-time updates"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

Please follow the existing code style (functional components, clear naming, no external state libraries) and test your changes before submitting.

---

## License

This project is released under the [MIT License](LICENSE).

```
MIT License — Copyright (c) 2026 krishnacode120

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: ...
```

---

<div align="center">

Made with ⚡ by [krishnacode120](https://github.com/krishnacode120)

**[⭐ Star this repo](https://github.com/krishnacode120/Smart-Energy-Monitoring-System-Virtual-IoT-Project-)** if you found it useful!

[![GitHub stars](https://img.shields.io/github/stars/krishnacode120/Smart-Energy-Monitoring-System-Virtual-IoT-Project-?style=social)](https://github.com/krishnacode120/Smart-Energy-Monitoring-System-Virtual-IoT-Project-)

</div>
