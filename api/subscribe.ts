import { Resend } from "resend";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const getFirebaseDB = () => {
  try {
    const firebaseConfigRaw = process.env.FIREBASE_CONFIG;
    if (firebaseConfigRaw) {
      const firebaseConfig = JSON.parse(firebaseConfigRaw);
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) { console.error("Firebase init error:", err); }
  return null;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { email, userAgent } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    let docId = "mock-id";
    const db = getFirebaseDB();

    // 1. SALVA NO FIREBASE
    if (db) {
      const docRef = await addDoc(collection(db, 'leads'), {
        email,
        createdAt: serverTimestamp(),
        userAgent: userAgent || "Vercel Function",
        protocol: 'SOMATIC_ACTIVATION_V4_VERCEL'
      });
      docId = docRef.id;
    }

    // 2. ENVIA E-MAIL DE BOAS-VINDAS (Resend)
    if (resend) {
      await resend.emails.send({
        from: 'VISTO_LAB <contato@lab.visto.art.br>',
        to: email,
        subject: 'Protocolo de Ativação - VISTO_LAB',
        html: `
        <div style="background-color: #050505; color: #00FF41; font-family: 'Courier New', Courier, monospace; padding: 40px; border: 2px solid #00FF41; line-height: 1.6;">
          <h2 style="text-transform: uppercase; letter-spacing: 0.3em; border-bottom: 1px solid #00FF41; padding-bottom: 10px;">VISTO_LAB</h2>
          <p style="font-weight: bold; text-transform: uppercase;">PROTOCOLO DE SINCRONIZAÇÃO INICIALIZADO</p>
          
          <p>Seu e-mail [${email}] foi integrado à nossa rede de ativação.</p>
          
          <p>Este é o primeiro passo para o acesso à plataforma <a href="https://visto.art.br" style="color: #00FF41; text-decoration: underline;">VISTO.ART.BR</a>.</p>
          
          <p>Em breve enviaremos as coordenadas para:</p>
          
          <ul style="list-style-type: none; padding-left: 0;">
            <li>> Workshops de código aberto</li>
            <li>> Acesso à Galeria de Arte Digital</li>
            <li>> Protocolos de Objetos Digitais Interativos</li>
          </ul>

          <div style="margin-top: 50px; text-align: center; border-top: 1px solid #00FF41; padding-top: 30px;">
            <p style="font-size: 8px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; color: #00FF41; opacity: 0.6;">Apoio e Realização</p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="font-size: 0; line-height: 0;">
                  <img src="https://lab.visto.art.br/regua-patrocinadores-green.png" 
                       alt="Institucional VISTO_LAB" 
                       width="600"
                       style="display: block; width: 100%; height: auto; border: 0; opacity: 0.9; pointer-events: none;">
                </td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 40px; font-size: 11px; opacity: 0.5; border-top: 1px solid #1a1a1a; padding-top: 20px;">
            SISTEMA VISTO_LAB // REDE SOMÁTICA-DIGITAL // 2026<br>
            FIM DA TRANSMISSÃO.
          </div>
        </div>
        `
      });
    }

    // 3. SINCRONIZA COM O BREVO
    if (process.env.BREVO_API_KEY) {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          email,
          updateEnabled: true,
          listIds: [2],
          attributes: { SOURCE: "VISTO_LAB_LANDING" }
        })
      });
    }

    return res.status(200).json({ status: "ok", id: docId });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
