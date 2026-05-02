# 📊 BasePoint | Modern Budgeting Coach

🔗 **Live Demo:** [https://basepoiint.netlify.app/](https://basepoiint.netlify.app/)

💻 **Github:** [https://github.com/Ankush23056/BasePoint.git](https://github.com/Ankush23056/BasePoint.git)

BasePoint is a high-fidelity personal finance manager built to help users who struggle with impulsive spending. Unlike traditional static trackers, BasePoint acts as a financial guardrail, using visual psychology and real-time "Safe Spending" metrics to encourage mindful consumption.

---

## 🛠 New: Budgeting Coach Features (V2)

### 🚨 The "Red Zone" Guardrails
**Dynamic Limits:** Define monthly spending caps for specific categories (Food, Shopping, etc.) in the settings.

**Visual Urgency:** Progress bars transition from Emerald to pulsing Red as you approach your limit, providing an immediate psychological nudge to curb spending.

### 💰 Daily Spending Power
**The "Safe" Number:** A real-time calculation of exactly how much you can spend today based on your remaining monthly budget and the number of days left in the month.

### 🔄 Dynamic Category Intelligence
**Contextual UI:** The app intelligently switches categories based on transaction type.

**Income Sources:** Track Salary, Stipends, Loans (Borrowed), and Returns (Debt Payback) separately for a clear picture of your cash flow.

**Expense Tracking:** Deep-dive into Bills, Healthcare, Investment, and more.

### 🏆 Savings Goals & Gamification
**Goal Tracking:** Set targets for emergency funds or big purchases and track your progress visually.

**Dopamine Hits:** Interactive confetti celebrations and progress animations (powered by Framer Motion) trigger when you reach your savings milestones.

---

## 📱 PWA Support (Mobile App Mode)
BasePoint is a Progressive Web App (PWA), allowing you to install it directly onto your phone for a native experience:

**On iPhone (Safari):** Tap the 'Share' icon and select "Add to Home Screen."

**On Android (Chrome):** Tap the three dots and select "Install App."

**Offline Access:** Once installed, BasePoint works 100% offline. Log expenses the moment they happen, even without an internet connection.

---

## 🚀 How to Use BasePoint (User Guide)

### 1. Wipe the Demo Data
The app is prepopulated with Demo Data to showcase the visualizations. To start your personal journey:

- Navigate to the ⚙️ Settings tab.
- Find the Data Management section.
- Click "Clear All Transactions". This wipes the local database and provides a fresh slate.

### 2. Set Your Guardrails
In the Settings tab, enter your monthly budget limits for categories like Food, Transport, and Entertainment. These limits power the "Red Zone" warnings on your dashboard.

### 3. Log & Track
Use the "Add Transaction" button on the dashboard to log expenses instantly.

Watch the Daily Spending Power widget to see how much "Safe Money" you have left for the day.

---

## ✨ Technical Highlights
**⚡ Reactive State Engine:** Powered by Zustand with persistent storage.

**📊 Dynamic Analytics:** Recharts/Tremor charts that automatically generate 6-month trends based on the current system date.

**🌓 Obsidian Frost Theme:** A high-contrast dark mode designed for focus and financial clarity.

**🔒 Privacy First:** All data is stored exclusively in your browser's localStorage. No cloud, no tracking, and no third-party data access.

---

## 🛠 Tech Stack
**Framework:** React 19 (Vite)

**State Management:** Zustand (Persist Middleware)

**Visuals:** Recharts & Tailwind CSS v4

**PWA:** Vite-plugin-pwa

**Animations:** Framer Motion

**Icons:** Lucide React

---

## 👤 Author
**Ankush Kumar | Frontend Developer**  
📍 Mumbai, India  
🌐 [Portfolio](https://ankush-dev.netlify.app/)

*Turning complex data into intuitive, behavioral tools.*
