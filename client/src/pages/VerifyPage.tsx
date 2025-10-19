import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import axios, { AxiosResponse } from "axios";

export default function VerifyPage() {
  const [message, setMessage] = useState("Verificando...");
  const [, setLocation] = useLocation(); // seconda variabile serve per cambiare pagina

  // Prende il token dai query params
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token mancante");
      return;
    }

    axios
      .get<string>(`http://localhost:5001/api/verify?token=${token}`)
      .then((res: AxiosResponse<string>) => setMessage(res.data))
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setMessage(err.response?.data || "Errore durante la verifica");
        } else {
          setMessage("Errore durante la verifica");
        }
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold">{message}</h1>
        <p className="text-sm text-slate-300">
          Grazie per aver verificato la tua email. Ora puoi accedere al tuo account.
        </p>
        <button
          onClick={() => setLocation("/auth")} // qui Wouter cambia percorso
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-6 rounded-xl shadow-md hover:shadow-lg"
        >
          Torna al login
        </button>
      </div>
    </div>
  );
}
