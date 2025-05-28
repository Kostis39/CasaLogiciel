export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-blue-300 p-4">
      <h2 className="text-xl font-semibold mb-2">Espace Profil</h2>
      <nav className="mb-4">
        <a href="/dev/sacha/profil">Accueil Profil</a> |{" "}
        <a href="/dev/sacha/profil/settings">Paramètres</a>
      </nav>
      <div className="bg-white p-4 rounded shadow">{children}</div>
    </div>
  );
}
