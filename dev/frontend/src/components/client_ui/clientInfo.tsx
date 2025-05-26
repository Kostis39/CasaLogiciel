import { fetchGrimpeurById } from "@/src/services/api";

export default async function ClientInfo({num}: { num: number | null }) {
  
  if (num !== null && num > 0) {
    const grimpeur = await fetchGrimpeurById(num);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Informations client</h1>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(grimpeur).map(([key, value]) => (
            <div key={key} className="border p-2 rounded">
              <strong className="block font-semibold">{key}:</strong>
              <span>{value !== null ? String(value) : "—"}</span>
            </div>
          ))}
  </div>
        {/* Ajoutez ici le reste des informations */}
      </div>
    );
  }

  return (
    <>
    </>
  );
}