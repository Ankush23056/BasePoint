# 🚀 BasePoint | Modern Finance Dashboard

🔗 **Live Demo:** [https://basepoiint.netlify.app/](https://basepoiint.netlify.app/)

💻 **Github:** [https://github.com/Ankush23056/BasePoint.git](https://github.com/Ankush23056/BasePoint.git)

BasePoint is a high-density, professional finance management interface built to help users track transactions, visualize spending patterns, and gain actionable financial insights.

Designed with a "Modern Fintech" aesthetic, it features a custom Obsidian Frost theme, real-time data reactivity, and a simulated Role-Based Access Control (RBAC) system.

---

## ✨ Key Features

### 📊 Interactive Visualizations
- **Balance Trend:** A smooth, monotone spline area chart showing equity fluctuations over time.
- **Spending Breakdown:** A high-density donut chart for categorical expense tracking with interactive tooltips.
- **Status Widgets:** At-a-glance cards for Total Balance, Earnings, and Expenses, featuring real-time percentage indicators (e.g., +4.2%) to track monthly growth dynamics.

### 🚀 Advanced Feature Set
- **🌓 Adaptive Theming:** A dual-mode interface (Obsidian Frost) designed for high-end financial environments. Includes a persistent Dark/Light toggle to reduce eye strain, fluidly styled with Tailwind CSS.
- **📊 High-Density Data Viz:** Leveraging Recharts for professional-grade charts, ensuring high fidelity, responsiveness, and beautiful gradient fills.
- **⚡ Reactive State Engine:** Powered by Zustand, ensuring that adding, deleting, or modifying a transaction instantly updates every chart, summary card, and insight metric across the app without a page refresh.
- **📥 Professional Data Export:** Built-in utility to export filtered transaction logs directly to CSV format, demonstrating a focus on user utility and data portability.
- **✨ Micro-Interactions:** Smooth page transitions, interactive hover states, and list animations powered by Framer Motion for a true "premium app" feel.
- **💡 Automated Insights:** A dedicated analytics view that automatically calculates savings rates, dominant spending categories, and contextual monthly observations.
- **⚙️ Advanced System Settings:** A centralized hub for application governance, including:
  - **Identity Management:** Integrated user profile section with dynamic role status.
  - **Security & Access:** A dedicated RBAC control center to toggle between Admin and Viewer roles, instantly updating system-wide permissions.
  - **Appearance & Localization:** Support for Dark Mode and Currency Localization (e.g., ₹ INR) to demonstrate internationalization (i18n) readiness.
  - **Data Management Utilities:** Implemented "Reset to Sample" and "Clear All" functions, allowing users to manage their local transaction database—a key feature for testing and debugging.

### 🔐 Simulated RBAC (Role-Based UI)
- **Admin Mode:** Full dashboard control, including the ability to add, edit, and clear transactions seamlessly.
- **Viewer Mode:** A restricted "Read-Only" mode where data-entry features and destructive actions are hidden or disabled to simulate permission-based security.

---

## 🛠 Tech Stack

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **State Management:** Zustand (with Persist Middleware)
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BasePoint.git
   cd BasePoint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🧠 Design Philosophy

The UI follows a **Bento Box layout**, prioritizing information density without clutter. By using a monochromatic base palette with highly purposeful color accents (Indigo for primary actions, Emerald for income, and Rose for expenses), the interface remains intuitive, accessible, and sophisticated. 

---

## 📈 Evaluation Highlights

This project was built to demonstrate:
- **Modularity:** Components are highly decoupled, reusable, and cleanly structured avoiding "spaghetti" code.
- **State Management:** Extensively used Zustand with persistent storage logic. The "Data Management" features demonstrate advanced state manipulation, allowing for bulk resets and deletions that sync across all dashboard charts and tables instantly.
- **UX/UI Polish:** Extreme attention to detail, including comprehensive empty states when no data is present, fluid route transitions, and flawless responsive breakpoints from ultra-wide desktops down to mobile devices.

---

## 👤 Author
**Ankush Kumar** | Frontend Developer Intern
