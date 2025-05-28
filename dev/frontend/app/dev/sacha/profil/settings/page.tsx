import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SearchClient from "@/src/components/client_ui/clientSearch";

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
      <p className="mb-6">Bienvenue dans la page des paramètres du profil.</p>

      {/* Bouton retour */}
      <Link
        href="/dev/sacha"
        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à Sacha
      </Link>

    </div>
  );
}
