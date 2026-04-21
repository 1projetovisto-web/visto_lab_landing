import { Handler } from "@netlify/functions";
import { Resend } from "resend";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Initialize Firebase (Lazy)
const getFirebaseDB = () => {
  try {
    // Tentativa de ler do ambiente ou do arquivo local
    const firebaseConfigRaw = process.env.FIREBASE_CONFIG;
    let firebaseConfig;

    if (firebaseConfigRaw) {
      firebaseConfig = JSON.parse(firebaseConfigRaw);
    } else {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      }
    }

    if (firebaseConfig) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) {
    console.error("Firebase init error:", err);
  }
  return null;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, userAgent } = JSON.parse(event.body || "{}");

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
  }

  try {
    let docId = "mock-id";
    const db = getFirebaseDB();

    // 1. Save to Firestore
    if (db) {
      const docRef = await addDoc(collection(db, 'leads'), {
        email,
        createdAt: serverTimestamp(),
        userAgent: userAgent || "Netlify Function",
        protocol: 'SOMATIC_ACTIVATION_V4_NETLIFY'
      });
      docId = docRef.id;
    }

    // 2. Send Email
    let emailSent = false;
    let emailError = null;

    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'VISTO_LAB <contato@lab.visto.art.br>',
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
        
        if (error) {
          emailError = error.message;
        } else {
          emailSent = true;
        }
      } catch (err: any) {
        emailError = err.message;
      }
    } else {
      emailError = "RESEND_API_KEY_MISSING";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: "ok", 
        id: docId, 
        emailSent,
        debug: emailError 
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
