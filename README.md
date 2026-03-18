# TempMail - Free Disposable Temporary Email

A modern, fast, and privacy-focused temporary email service built with vanilla HTML, CSS, JavaScript, and Vite. Powered by the [CatchMail API](https://catchmail.io).

## ✨ Features
-   **Instant Email Generation:** Create disposable email addresses instantly with no signup required.
-   **Custom Domain Support:** Use your own custom domain (e.g., `test@yourdomain.com`).
-   **Premium Vintage Aesthetic:** Beautifully designed single-card UI with a vintage "ডাক টিকেট" (postage stamp) theme.
-   **Real-time Inbox:** Inbox auto-refreshes to fetch incoming messages instantly.
-   **Mobile First & Responsive:** Optimized for both desktop and mobile screens.
-   **Full API Documentation:** Built-in API documentation page for developers.
-   **Local Storage Persistence:** Remembers your generated email address and domain preference across sessions.

## 🚀 Technologies Used
-   Frontend: Vanilla HTML5, CSS3, JavaScript (ES6+)
-   Build Tool: [Vite](https://vitejs.dev/)
-   API Integration: CatchMail.io REST API

## 💻 Local Development Setup

To run this project locally, you need [Node.js](https://nodejs.org/) installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdullahalmamun-devv/tempmail-site.git
    cd tempmail-site
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:5173` in your browser.

> **Note on CORS:** The Vite configuration (`vite.config.js`) includes a proxy to forward `/api` requests to `https://api.catchmail.io`. This bypasses browser CORS restrictions during development. In production, ensure your hosting environment supports routing or use the API directly if permitted.

## 🌐 Custom Domain Setup

You can use any domain with this TempMail client.

**DNS Configuration:**
1.  Go to your domain's DNS provider (Namecheap, Cloudflare, etc.).
2.  Add a new **MX Record** pointing to CatchMail:
    *   **Type:** MX
    *   **Host:** `@` (or a subdomain)
    *   **Value:** `smtp.catchmail.io`
    *   **Priority:** 10
    *   **TTL:** Auto/3600
3.  Wait for the DNS to propagate.
4.  Open the website, click **+ Add Custom Domain**, and enter your domain name.

## 📁 Project Structure

```text
tempmail-site/
├── docs.html           # Full API Documentation Page
├── index.html          # Main Application Page
├── package.json        # NPM dependencies & scripts
├── README.md           # This documentation file
├── vite.config.js      # Vite configuration & proxy settings
├── public/             # Static assets (favicons, etc.)
└── src/
    ├── main.js         # Core application logic, API calls, and UI state
    └── style.css       # Complete aesthetic, layout, and mobile breakpoints
```

## 📜 License
This project is open-source and free to use. Powered by CatchMail.io.
