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
        
        const settings = await getSiteSettings();
        const siteTitle = settings?.ogTitle || settings?.siteName || "Sohanur Construction & Manpower Solution";
        const siteDesc = settings?.ogDescription || "Need Construction Workers? অথবা কাজ খুঁজছেন? আমরা সরবরাহ করি দক্ষ Rod Mistry, Raj Mistry, Helper, Welder & Fitter। আজই যোগাযোগ করুন।";
        const siteImage = settings?.ogImage || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop";
        const siteUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

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
        const settings = await getSiteSettings();
        
        const siteTitle = settings?.ogTitle || settings?.siteName || "Sohanur Construction & Manpower Solution";
        const siteDesc = settings?.ogDescription || "Need Construction Workers? অথবা কাজ খুঁজছেন? আমরা সরবরাহ করি দক্ষ Rod Mistry, Raj Mistry, Helper, Welder & Fitter। আজই যোগাযোগ করুন।";
        const siteImage = settings?.ogImage || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop";
        const siteUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

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
