import { Resend } from "resend";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Inicialização Firebase
const getFirebaseDB = () => {
  try {
    const firebaseConfigRaw = process.env.FIREBASE_CONFIG;
    if (firebaseConfigRaw) {
      const firebaseConfig = JSON.parse(firebaseConfigRaw);
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) {
    console.error("Firebase init error:", err);
  }
  return null;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// FORMATO VERCEL FUNCTION (O segredo para funcionar aqui)
export default async function handler(req: any, res: any) {
  // Na Vercel usamos req.method em vez de event.httpMethod
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Na Vercel o corpo já vem pronto em req.body
  const { email, userAgent } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    let docId = "mock-id";
    const db = getFirebaseDB();

    if (db) {
      const docRef = await addDoc(collection(db, 'leads'), {
        email,
        createdAt: serverTimestamp(),
        userAgent: userAgent || "Vercel Function",
        protocol: 'SOMATIC_ACTIVATION_V4_VERCEL'
      });
      docId = docRef.id;
    }

    if (resend) {
      await resend.emails.send({
        from: 'VISTO_LAB <contato@lab.visto.art.br>',
        to: email,
        subject: 'Protocolo de Ativação - VISTO_LAB',
        html: `<div style="font-family: monospace; background: #050505; color: #00FF41; padding: 40px; border: 1px solid #00FF41;">
                <h1 style="border-bottom: 1px solid #00FF41; padding-bottom: 20px; font-weight: normal;">VISTO_LAB</h1>
                <p><strong>PROTOCOLO DE SINCRONIZAÇÃO INICIALIZADO</strong></p>
                <p>Seu e-mail [${email}] foi integrado à nossa rede de ativação.</p>
              </div>`
      });
    }

    return res.status(200).json({ status: "ok", id: docId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
