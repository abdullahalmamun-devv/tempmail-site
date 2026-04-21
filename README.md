# ✉️ TempMail — World-Class Disposable Email Service

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/abdullahalmamun-devv/tempmail-site/graphs/commit-activity)

**TempMail** is a modern, high-performance, and privacy-centric temporary email platform. Built with a focus on speed, security, and a premium user experience, it allows users to generate disposable email addresses instantly without any registration. Powered by the robust [CatchMail API](https://catchmail.io).

---

## 🚀 Key Features

- **⚡ Instant Generation:** Create a fully functional mailbox in one click.
- **🎨 Premium Aesthetic:** A unique "Postage Stamp" vintage UI that is both elegant and highly functional.
- **🌐 Custom Domain Support:** Seamlessly integrate your own domains by simply configuring MX records.
- **🔄 Real-time Updates:** Automated polling system ensures you see new emails as they arrive without refreshing.
- **📱 Responsive by Design:** A mobile-first approach ensuring a perfect experience on desktops, tablets, and smartphones.
- **💾 Local Persistence:** Your active session and preferences are securely saved in your browser's local storage.
- **🛠 Developer Friendly:** Includes a comprehensive API documentation page for building integrations.
- **🗑 Privacy First:** No tracking, no logs, and easy message deletion.

---

## 🛠 Tech Stack

- **Frontend Core:** Vanilla HTML5, CSS3 (Modern Flexbox/Grid), JavaScript (ES6+ Modules)
- **Build System:** [Vite](https://vitejs.dev/) for lightning-fast development and optimized production builds.
- **API Engine:** [CatchMail.io](https://catchmail.io) RESTful API.
- **Deployment Ready:** Configured for seamless deployment on [Vercel](https://vercel.com).

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abdullahalmamun-devv/tempmail-site.git
   cd tempmail-site
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```
   *Your app is now running at `http://localhost:5173`!*

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🌐 Custom Domain Integration

Empower your brand by using your own domain for temporary mail.

### DNS Configuration
To use a custom domain, add the following **MX Record** to your DNS provider (e.g., Cloudflare, Namecheap, GoDaddy):

| Type | Host | Value | Priority |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | `smtp.catchmail.io` | `10` |

*Note: DNS propagation can take up to 24-48 hours, though it usually happens within minutes.*

---

## 📁 Project Architecture

```text
tempmail-site/
├── public/             # Static assets (favicons, manifest, etc.)
├── src/
│   ├── main.js         # State management, API integration, & UI logic
│   └── style.css       # Design system, components, & responsiveness
├── index.html          # Main Application Entry Point
├── docs.html           # Interactive API Documentation
├── vercel.json         # Vercel deployment configuration
├── vite.config.js      # Vite build & proxy settings
└── package.json        # Project metadata & dependencies
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🛡 Security & Privacy

TempMail is built with a privacy-first mindset.
- No personal data is ever requested or stored.
- All email data is fetched directly from the CatchMail API.
- For security reasons, we recommend not using temporary emails for sensitive accounts (e.g., banking).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ✨ Acknowledgments

- Powered by [CatchMail.io](https://catchmail.io)
- Icons and UI inspiration from the open-source community.

---

<p align="center">
  Built with ❤️ for the Privacy-Conscious Web
</p>
