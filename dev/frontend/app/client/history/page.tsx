"use client";
import { useState, useEffect, useRef } from "react";
export const API_URL = "http://127.0.0.1:5000";
import { ApiResponse, Seance, Transaction } from "@/src/types&fields/types";
import { ConfirmButton } from "@/src/components/client_ui/buttonConfirm";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // si ce n’est pas une vraie date
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


// Modal générique pour modifier
function EditModal<T extends object>({
  item,
  fields,
  onClose,
  onSave,
}: {
  item: T | null;
  fields: (keyof T)[];
  onClose: () => void;
  onSave: (updated: T) => void;
}) {
  const [formData, setFormData] = useState<T | null>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  if (!item || !formData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white p-4 rounded shadow w-96 z-10">
        <h2 className="text-lg font-bold mb-2">Modifier</h2>
        {fields.map((key) => (
          <div className="mb-2" key={String(key)}>
            <label className="block text-sm font-medium mb-1">
              {String(key)}
            </label>
            <input
              type="text"
              value={(formData as any)[key] ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [tab, setTab] = useState<"transactions" | "seances">("transactions");

  const [filters, setFilters] = useState({
    type: "all",
    id: "",
    grimpeur: "",
    date: "",
    limit: 20,
    offset: 0,
  });

  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [hasMoreSeances, setHasMoreSeances] = useState(true);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editingSeance, setEditingSeance] = useState<Seance | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // -------------------------------
  // FETCH TRANSACTIONS
  // -------------------------------
  const fetchTransactions = async () => {
    try {
      let url = `${API_URL}/transactions`;
      if (filters.type === "id" && filters.id)
        url = `${API_URL}/transactions/id/${filters.id}`;
      else if (filters.type === "grimpeur" && filters.grimpeur)
        url = `${API_URL}/transactions/grimpeur/${filters.grimpeur}`;
      else if (filters.type === "date" && filters.date)
        url = `${API_URL}/transactions/date/${filters.date}`;

      url += `?limit=${filters.limit}&offset=${filters.offset}`;

      const res = await fetch(url);
      const json: ApiResponse<Transaction[]> = await res.json();

      if (res.ok && json.data) {
        setTransactions(json.data);
        setHasMoreTransactions(json.data.length === filters.limit);
      } else {
        setTransactions([]);
        setHasMoreTransactions(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // FETCH SEANCES
  // -------------------------------
  const fetchSeances = async () => {
    try {
      let url = `${API_URL}/seances`;
      if (filters.type === "id" && filters.id)
        url = `${API_URL}/seances/id/${filters.id}`;
      else if (filters.type === "grimpeur" && filters.grimpeur)
        url = `${API_URL}/seances/grimpeur/${filters.grimpeur}`;
      else if (filters.type === "date" && filters.date)
        url = `${API_URL}/seances/date/${filters.date}`;

      url += `?limit=${filters.limit}&offset=${filters.offset}`;

      const res = await fetch(url);
      const json: ApiResponse<Seance[]> = await res.json();

      if (res.ok && json.data) {
        setSeances(json.data);
        setHasMoreSeances(json.data.length === filters.limit);
      } else {
        setSeances([]);
        setHasMoreSeances(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // AUTO-REFRESH LORSQUE FILTRES OU ONGLET CHANGE
  // -------------------------------
  useEffect(() => {
    if (tab === "transactions") fetchTransactions();
    else fetchSeances();
  }, [filters, tab]);

  // -------------------------------
  // SAVE / DELETE
  // -------------------------------
  const handleSaveTransaction = async (t: Transaction) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    });
    alert((await res.json()).message);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleSaveSeance = async (s: Seance) => {
    const res = await fetch(`${API_URL}/seances`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    alert((await res.json()).message);
    setEditingSeance(null);
    fetchSeances();
  };

  const handleDeleteTransaction = async (id: number) => {
    const res = await fetch(`${API_URL}/transactions/id/${id}`, {
      method: "DELETE",
    });
    alert((await res.json()).message);
    fetchTransactions();
  };

  const handleDeleteSeance = async (id: number) => {
    const res = await fetch(`${API_URL}/seances/id/${id}`, { method: "DELETE" });
    alert((await res.json()).message);
    fetchSeances();
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Administration</h1>

      {/* Onglets */}
      <div className="mb-4 flex flex-col gap-2" ref={tableContainerRef}>
        <div>
          <button
            onClick={() => {
              setTab("transactions");
              setFilters((prev) => ({ ...prev, offset: 0 }));
            }}
            className={`mr-2 px-3 py-1 ${
              tab === "transactions"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Transactions
          </button>

          <button
            onClick={() => {
              setTab("seances");
              setFilters((prev) => ({ ...prev, offset: 0 }));
            }}
            className={`px-3 py-1 ${
              tab === "seances"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Séances
          </button>
        </div>

        {/* Filtres dynamiques */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:gap-3 w-full md:w-auto">
          {/* Sélecteur du type de recherche */}
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters({
                ...filters,
                type: e.target.value,
                id: "",
                grimpeur: "",
                date: "",
                offset: 0,
              })
            }
            className="border px-3 py-2 rounded"
          >
            <option value="all">Tous</option>
            <option value="id">Par ID</option>
            <option value="grimpeur">Par Grimpeur</option>
            <option value="date">Par Date</option>
          </select>

          {/* Champ de recherche selon le type */}
          {filters.type !== "all" && (
            <input
              type={filters.type === "date" ? "date" : "number"}
              placeholder={
                filters.type === "id"
                  ? tab === "transactions"
                    ? "ID Transaction"
                    : "ID Séance"
                  : filters.type === "grimpeur"
                  ? "Num Grimpeur"
                  : "Date"
              }
              value={
                filters.type === "id"
                  ? filters.id
                  : filters.type === "grimpeur"
                  ? filters.grimpeur
                  : filters.date
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  id: filters.type === "id" ? e.target.value : "",
                  grimpeur:
                    filters.type === "grimpeur" ? e.target.value : "",
                  date: filters.type === "date" ? e.target.value : "",
                  offset: 0,
                })
              }
              className="border px-3 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 border-blue-500 ring-blue-400"
            />
          )}
        </div>
      </div>

      {/* TABLEAUX */}
      {tab === "transactions" ? (
        transactions.length ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-1">ID</th>
                <th className="border p-1">Grimpeur</th>
                <th className="border p-1">Type</th>
                <th className="border p-1">Date</th>
                <th className="border p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.IdTransac}>
                  <td className="border p-1">{t.IdTransac}</td>
                  <td className="border p-1">{t.NumGrimpeur ?? "-"}</td>
                  <td className="border p-1">{t.TypeObjet}</td>
                  <td className="border p-1">{formatDate(t.DateTransac)}</td>
                  <td className="border p-1 flex gap-1">
                    <button
                      onClick={() => setEditingTransaction(t)}
                      className="bg-green-500 px-2 text-white rounded hover:bg-green-600 transition"
                    >
                      Modifier
                    </button>
                    <ConfirmButton
                      triggerText="Supprimer"
                      title="Confirmation de suppression"
                      description={`Voulez-vous vraiment supprimer la transaction ${t.IdTransac} ?`}
                      onConfirm={() => handleDeleteTransaction(t.IdTransac)}
                      variantConfirm="destructive"
                      triggerVariant="outline"
                      triggerClassName="px-2 bg-red-500 text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">Aucune transaction trouvée.</p>
        )
      ) : seances.length ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-1">ID</th>
              <th className="border p-1">Grimpeur</th>
              <th className="border p-1">Type</th>
              <th className="border p-1">Date</th>
              <th className="border p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seances.map((s) => (
              <tr key={s.IdSeance}>
                <td className="border p-1">{s.IdSeance}</td>
                <td className="border p-1">{s.NumGrimpeur}</td>
                <td className="border p-1">{s.TypeEntree}</td>
                <td className="border p-1">{formatDate(s.DateSeance)}</td>
                <td className="border p-1 flex gap-1">
                  <button
                    onClick={() => setEditingSeance(s)}
                    className="bg-green-500 px-2 text-white rounded hover:bg-green-600 transition"
                  >
                    Modifier
                  </button>
                  <ConfirmButton
                    triggerText="Supprimer"
                    title="Confirmation de suppression"
                    description={`Voulez-vous vraiment supprimer la séance ${s.IdSeance} ?`}
                    onConfirm={() => handleDeleteSeance(s.IdSeance)}
                    variantConfirm="destructive"
                    triggerVariant="outline"
                    triggerClassName="px-2 bg-red-500 text-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mt-4">Aucune séance trouvée.</p>
      )}

      {/* PAGINATION */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          disabled={filters.offset === 0}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              offset: Math.max(0, prev.offset - prev.limit),
            }))
          }
        >
          ← Précédent
        </button>

        <span className="px-2 py-1 text-gray-700 font-medium">
          Page {Math.floor(filters.offset / filters.limit) + 1}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          disabled={tab === "transactions" ? !hasMoreTransactions : !hasMoreSeances}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              offset: prev.offset + prev.limit,
            }))
          }
        >
          Suivant →
        </button>
      </div>

      {/* MODALS */}
      {editingTransaction && (
        <EditModal
          item={editingTransaction}
          fields={Object.keys(editingTransaction).filter(
            (k) => k !== "IdTransac"
          ) as (keyof Transaction)[]}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveTransaction}
        />
      )}
      {editingSeance && (
        <EditModal
          item={editingSeance}
          fields={Object.keys(editingSeance).filter(
            (k) => k !== "IdSeance"
          ) as (keyof Seance)[]}
          onClose={() => setEditingSeance(null)}
          onSave={handleSaveSeance}
        />
      )}
    </div>
  );
}
