// server/utils/emailService.js
import nodemailer from "nodemailer";

// --- DEBUG variabili ambiente ---
console.log("DEBUG SMTP VARS:");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
// Non stampare mai la password in console!
// console.log("SMTP_PASS:", process.env.SMTP_PASS);

// --- Configurazione transporter per Brevo ---
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // es: smtp-relay.brevo.com
  port: parseInt(process.env.SMTP_PORT, 10), // 587
  secure: false,                          // STARTTLS
  auth: {
    user: process.env.SMTP_USER,          // accesso SMTP Brevo
    pass: process.env.SMTP_PASS,          // chiave SMTP Brevo
  },
  logger: true,  // utile per debug
  debug: true,   // utile per debug
});

// --- Funzione per invio email di verifica ---
export const sendVerificationEmail = async (email, token) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Errore: variabili SMTP mancanti!");
    return;
  }

  const verificationLink = `http://localhost:5173/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,  // mittente verificato su Brevo
      to: email,
      subject: "Verifica la tua email su TorneoLive",
      html: `
        <h2>Benvenuto su TorneoLive!</h2>
        <p>Per completare la registrazione, clicca sul link seguente:</p>
        <a href="${verificationLink}">Verifica ora</a>
        <p>Se non hai richiesto questo account, ignora questa email.</p>
      `,
    });
    console.log("✅ Email di verifica inviata a:", email);
  } catch (err) {
    console.error("❌ Errore SMTP:", err.message);
  }
};
