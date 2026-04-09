import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Telegram Notifications (Supports both local and Netlify paths)
  const notifyHandler = async (req: any, res: any) => {
    const { message } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "8037861551:AAGCdukJlMoh0LeTuJ8nAasAu_BK4e8S9Vs";
    const chatId = process.env.TELEGRAM_CHAT_ID || "8329392163";

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();
      if (data.ok) {
        res.json({ success: true });
      } else {
        console.error("Telegram API Error:", data);
        res.status(500).json({ error: "Failed to send Telegram notification" });
      }
    } catch (error) {
      console.error("Notification Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  app.post("/api/notify", notifyHandler);
  app.post("/.netlify/functions/notify", notifyHandler);

  // Initialize Firebase for server-side use
  const configPath = path.join(__dirname, "firebase-applet-config.json");
  let firebaseApp;
  let db: any;

  try {
    if (fs.existsSync(configPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    }
  } catch (e) {
    console.error("Error initializing Firebase on server:", e);
  }

  async function getSiteSettings() {
    if (!db) return null;
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      console.error("Error fetching settings on server:", e);
    }
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        
        // Hardcoded SEO metadata as requested
        const siteTitle = "Sohanur Construction & Manpower Solution";
        const siteDesc = "Need Construction Workers? অথবা কাজ খুঁজছেন? আমরা সরবরাহ করি দক্ষ Rod Mistry, Raj Mistry, Helper, Welder & Fitter। আজই যোগাযোগ করুন।";
        const siteImage = "https://scmsbd.netlify.app/logo.png";
        const siteUrl = `https://scmsbd.netlify.app${req.originalUrl}`;

        const ogTags = `
          <title>${siteTitle}</title>
          <meta name="description" content="${siteDesc}">
          <meta property="og:title" content="${siteTitle}">
          <meta property="og:description" content="${siteDesc}">
          <meta property="og:image" content="${siteImage}">
          <meta property="og:url" content="${siteUrl}">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${siteTitle}">
          <meta name="twitter:description" content="${siteDesc}">
          <meta name="twitter:image" content="${siteImage}">
        `;
        
        template = template.replace("<!-- OG_TAGS_PLACEHOLDER -->", ogTags);
        
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    
    app.get("*", async (req, res) => {
      try {
        let template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        
        // Hardcoded SEO metadata as requested
        const siteTitle = "Sohanur Construction & Manpower Solution";
        const siteDesc = "Need Construction Workers? অথবা কাজ খুঁজছেন? আমরা সরবরাহ করি দক্ষ Rod Mistry, Raj Mistry, Helper, Welder & Fitter। আজই যোগাযোগ করুন।";
        const siteImage = "https://scmsbd.netlify.app/logo.png";
        const siteUrl = `https://scmsbd.netlify.app${req.originalUrl}`;

        const ogTags = `
          <title>${siteTitle}</title>
          <meta name="description" content="${siteDesc}">
          <meta property="og:title" content="${siteTitle}">
          <meta property="og:description" content="${siteDesc}">
          <meta property="og:image" content="${siteImage}">
          <meta property="og:url" content="${siteUrl}">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${siteTitle}">
          <meta name="twitter:description" content="${siteDesc}">
          <meta name="twitter:image" content="${siteImage}">
        `;
        
        template = template.replace("<!-- OG_TAGS_PLACEHOLDER -->", ogTags);
        
        res.status(200).set({ "Content-Type": "text/html" }).send(template);
      } catch (e) {
        res.status(500).end(e as any);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
