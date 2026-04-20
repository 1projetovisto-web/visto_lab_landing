import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load Firebase Config
  let firebaseApp;
  let db;
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) {
    console.error("Firebase initialization failed on server:", err);
  }

  // Initialize Resend
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  // API Routes
  app.post("/api/subscribe", async (req, res) => {
    const { email, userAgent } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      let docId = "mock-id";

      // 1. Save to Firestore if available
      if (db) {
        const docRef = await addDoc(collection(db, 'leads'), {
          email,
          createdAt: serverTimestamp(),
          userAgent: userAgent || "Server Side",
          protocol: 'SOMATIC_ACTIVATION_V3_RESEND'
        });
        docId = docRef.id;
      }

      // 2. Send Email via Resend
      if (resend) {
        try {
          await resend.emails.send({
            from: 'VISTO_LAB <contato@visto.art.br>',
            to: email,
            subject: 'Protocolo de Ativação - VISTO_LAB',
            html: `
              <div style="font-family: monospace; background: #050505; color: #00FF41; padding: 40px; border: 1px solid #00FF41;">
                <h1 style="border-bottom: 1px solid #00FF41; padding-bottom: 20px; font-weight: normal;">VISTO_LAB</h1>
                <p style="font-size: 16px;"><strong>PROTOCOLO DE SINCRONIZAÇÃO INICIALIZADO</strong></p>
                <p>Seu e-mail [${email}] foi integrado à nossa rede de ativação.</p>
                <p>Este é o primeiro passo para o acesso à plataforma VISTO.ART.BR.</p>
                <p>Em breve enviaremos as coordenadas para:</p>
                <ul>
                  <li>Workshops de código aberto</li>
                  <li>Acesso à Galeria de Arte Digital</li>
                  <li>Protocolos de Objetos Digitais Interativos</li>
                </ul>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 11px; color: #008f25;">
                  SISTEMA VISTO_LAB // REDE SOMÁTICA // 2024<br/>
                  FIM DA TRANSMISSÃO.
                </div>
              </div>
            `
          });
          console.log(`Email successfully sent to ${email}`);
        } catch (emailError: any) {
          console.error("Resend operation failed:", emailError.message);
        }
      } else {
        console.warn("RESEND_API_KEY NOT SET - Email not sent.");
      }

      res.status(200).json({ status: "ok", id: docId });
    } catch (error: any) {
      console.error("Subscription process error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production build serving
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.get('*', (req, res) => {
        res.status(404).send("Production build not found. Please run 'npm run build'.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
